import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameRoomService } from './game-room.service';
import { BotAIService } from './bot-ai.service';
import { Inject, OnModuleInit } from '@nestjs/common';
import {
  CreateRoomDto,
  JoinRoomDto,
  PlayerReadyDto,
  GameActionDto,
  ChallengeActionDto,
  BlockActionDto,
  LoseInfluenceDto,
} from './dto/game-events.dto';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://gigio-coup.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(GameRoomService) private readonly gameRoomService: GameRoomService,
    @Inject(BotAIService) private readonly botAIService: BotAIService,
  ) {}

  onModuleInit() {
    console.log('🎮 GameGateway initialized');
    console.log('📦 GameRoomService:', this.gameRoomService ? 'OK' : 'UNDEFINED');
    console.log('🤖 BotAIService:', this.botAIService ? 'OK' : 'UNDEFINED');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    const result = this.gameRoomService.leaveRoom(client.id);
    
    if (result) {
      const { roomId, room } = result;
      
      if (room) {
        // Notifica os outros jogadores
        this.server.to(roomId).emit('playerLeft', room);
      } else {
        // Sala foi fechada
        this.server.to(roomId).emit('roomClosed', { roomId });
      }
    }
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @MessageBody() data: CreateRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.createRoom(
      data.playerName,
      client.id,
      data.maxPlayers,
      data.isPrivate,
    );

    client.join(room.id);
    client.emit('roomCreated', room);
    
    return { success: true, room };
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.joinRoom(data.roomId, data.playerName, client.id);

    if (!room) {
      client.emit('error', { message: 'Não foi possível entrar na sala' });
      return { success: false };
    }

    client.join(room.id);
    this.server.to(room.id).emit('playerJoined', room);

    // Se for um bot, marcar como pronto automaticamente
    if (data.playerName.startsWith('Bot')) {
      const botPlayer = room.players.find(p => p.name === data.playerName);
      if (botPlayer) {
        setTimeout(() => {
          const updatedRoom = this.gameRoomService.setPlayerReady(room.id, botPlayer.id);
          if (updatedRoom) {
            this.server.to(room.id).emit('playerReadyUpdate', updatedRoom);
          }
        }, 500);
      }
    }

    return { success: true, room };
  }

  @SubscribeMessage('getRooms')
  handleGetRooms(@ConnectedSocket() client: Socket) {
    const rooms = this.gameRoomService.getAllRooms();
    client.emit('roomsList', rooms);
  }

  @SubscribeMessage('playerReady')
  handlePlayerReady(
    @MessageBody() data: PlayerReadyDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.setPlayerReady(data.roomId, data.playerId);

    if (!room) {
      client.emit('error', { message: 'Sala não encontrada' });
      return { success: false };
    }

    this.server.to(room.id).emit('playerReadyUpdate', room);

    return { success: true, room };
  }

  @SubscribeMessage('startGame')
  handleStartGame(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.startGame(data.roomId);

    if (!room) {
      client.emit('error', { message: 'Não foi possível iniciar o jogo' });
      return { success: false };
    }

    this.server.to(room.id).emit('gameStarted', room);

    // Iniciar turno do bot se for o primeiro jogador
    setTimeout(() => {
      this.processBotTurn(room.id);
    }, 2000);

    return { success: true, room };
  }

  @SubscribeMessage('gameAction')
  handleGameAction(
    @MessageBody() data: GameActionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.getRoom(data.roomId);

    if (!room) {
      return { success: false };
    }

    // Define se a ação pode ser bloqueada ou desafiada
    const canBeChallenged = ['tax', 'assassinate', 'exchange', 'steal'].includes(data.action);
    const canBeBlocked = ['foreign_aid', 'assassinate', 'steal'].includes(data.action);

    // Atualiza a ação pendente
    this.gameRoomService.updatePendingAction(data.roomId, {
      type: data.action,
      playerId: data.playerId,
      targetId: data.targetId,
      canBeBlocked,
      canBeChallenged,
      claimedCharacter: data.claimedCharacter,
    });

    // Broadcast para todos os jogadores
    this.server.to(data.roomId).emit('actionPerformed', {
      room,
      action: data.action,
      playerId: data.playerId,
      targetId: data.targetId,
      canBeChallenged,
      canBeBlocked,
    });

    // Processar resposta dos bots (desafio ou bloqueio)
    if (canBeChallenged || canBeBlocked) {
      setTimeout(() => {
        this.processBotChallenge(data.roomId);
      }, 2000);
    } else {
      // Ação não pode ser contestada, passar direto
      setTimeout(() => {
        this.handlePassAction({ roomId: data.roomId }, null as any);
      }, 2000);
    }

    return { success: true };
  }

  @SubscribeMessage('challengeAction')
  handleChallengeAction(
    @MessageBody() data: ChallengeActionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.getRoom(data.roomId);

    if (!room || !room.pendingAction) {
      return { success: false };
    }

    // Broadcast do desafio
    this.server.to(data.roomId).emit('actionChallenged', {
      challengerId: data.playerId,
      challengedPlayerId: data.challengedPlayerId,
      room,
    });

    return { success: true };
  }

  @SubscribeMessage('blockAction')
  handleBlockAction(
    @MessageBody() data: BlockActionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.getRoom(data.roomId);

    if (!room || !room.pendingAction) {
      return { success: false };
    }

    // Broadcast do bloqueio
    this.server.to(data.roomId).emit('actionBlocked', {
      blockerId: data.playerId,
      blockWith: data.claimedCharacter || data.blockWith,
      room,
    });

    return { success: true };
  }

  @SubscribeMessage('loseInfluence')
  handleLoseInfluence(
    @MessageBody() data: LoseInfluenceDto,
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.getRoom(data.roomId);

    if (!room) {
      return { success: false };
    }

    const player = room.players.find(p => p.id === data.playerId);
    
    if (player && player.cards[data.cardIndex]) {
      // Remove a carta (revela)
      player.cards.splice(data.cardIndex, 1);
      
      // Se não tem mais cartas, está eliminado
      if (player.cards.length === 0) {
        player.isAlive = false;
      }
    }

    // Limpa ação pendente
    this.gameRoomService.updatePendingAction(data.roomId, undefined);

    // Próximo turno
    this.gameRoomService.nextTurn(data.roomId);

    // Broadcast da atualização
    this.server.to(data.roomId).emit('influenceLost', { room });

    // Verificar se é turno de um bot
    setTimeout(() => {
      this.processBotTurn(data.roomId);
    }, 1500);

    return { success: true, room };
  }

  @SubscribeMessage('passAction')
  handlePassAction(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = this.gameRoomService.getRoom(data.roomId);

    if (!room) {
      return { success: false };
    }

    // Limpa ação pendente
    this.gameRoomService.updatePendingAction(data.roomId, undefined);

    // Próximo turno
    this.gameRoomService.nextTurn(data.roomId);

    // Broadcast
    this.server.to(data.roomId).emit('actionPassed', { room });

    // Verificar se é turno de um bot
    setTimeout(() => {
      this.processBotTurn(data.roomId);
    }, 1500);

    return { success: true };
  }

  // ===== MÉTODOS DE IA DO BOT =====

  private processBotTurn(roomId: string) {
    const room = this.gameRoomService.getRoom(roomId);
    if (!room || room.phase !== 'action') return;

    const currentPlayer = room.players.find(p => p.id === room.currentPlayer);
    if (!currentPlayer || !currentPlayer.name.startsWith('Bot')) return;

    console.log(`🤖 Bot ${currentPlayer.name} está pensando...`);

    // Bot decide a ação
    const decision = this.botAIService.decideAction(room, currentPlayer);

    setTimeout(() => {
      this.handleGameAction(
        {
          roomId,
          playerId: currentPlayer.id,
          action: decision.action,
          targetId: decision.targetId,
          claimedCharacter: decision.claimedCharacter,
        },
        null as any,
      );
    }, 1500 + Math.random() * 1500); // 1.5-3s delay para parecer humano
  }

  private processBotChallenge(roomId: string) {
    const room = this.gameRoomService.getRoom(roomId);
    if (!room || !room.pendingAction) return;

    // Verificar bots que podem desafiar
    const bots = room.players.filter(
      p => p.isAlive && 
      p.name.startsWith('Bot') && 
      p.id !== room.pendingAction.playerId
    );

    for (const bot of bots) {
      const shouldChallenge = this.botAIService.shouldChallenge(
        room,
        bot,
        room.pendingAction.type,
        room.pendingAction.claimedCharacter,
      );

      if (shouldChallenge) {
        console.log(`🤖 Bot ${bot.name} vai desafiar!`);
        
        setTimeout(() => {
          this.handleChallengeAction(
            {
              roomId,
              playerId: bot.id,
              challengedPlayerId: room.pendingAction.playerId,
            },
            null as any,
          );
        }, 1000 + Math.random() * 2000);
        
        return; // Apenas um bot desafia por vez
      }
    }

    // Se nenhum bot desafiou, verificar bloqueio
    setTimeout(() => {
      this.processBotBlock(roomId);
    }, 2500);
  }

  private processBotBlock(roomId: string) {
    const room = this.gameRoomService.getRoom(roomId);
    if (!room || !room.pendingAction || !room.pendingAction.canBeBlocked) return;

    const bots = room.players.filter(
      p => p.isAlive && 
      p.name.startsWith('Bot') && 
      p.id !== room.pendingAction.playerId
    );

    for (const bot of bots) {
      const decision = this.botAIService.shouldBlock(
        room,
        bot,
        room.pendingAction.type,
      );

      if (decision.block) {
        console.log(`🤖 Bot ${bot.name} vai bloquear com ${decision.claimedCharacter}!`);
        
        setTimeout(() => {
          this.handleBlockAction(
            {
              roomId,
              playerId: bot.id,
              claimedCharacter: decision.claimedCharacter,
            },
            null as any,
          );
        }, 1000 + Math.random() * 2000);
        
        return;
      }
    }

    // Se nenhum bot bloqueou, passar ação
    setTimeout(() => {
      this.handlePassAction({ roomId }, null as any);
    }, 1500);
  }

  private processBotLoseInfluence(roomId: string, botId: string) {
    const room = this.gameRoomService.getRoom(roomId);
    if (!room) return;

    const bot = room.players.find(p => p.id === botId);
    if (!bot || !bot.name.startsWith('Bot')) return;

    const cardToReveal = this.botAIService.chooseCardToReveal(bot);
    const cardIndex = bot.cards.findIndex(c => c.character === cardToReveal && !c.revealed);

    if (cardIndex === -1) return;

    console.log(`🤖 Bot ${bot.name} vai revelar ${cardToReveal}`);

    setTimeout(() => {
      this.handleLoseInfluence(
        {
          roomId,
          playerId: botId,
          cardIndex,
        },
        null as any,
      );
    }, 1500);
  }
}
