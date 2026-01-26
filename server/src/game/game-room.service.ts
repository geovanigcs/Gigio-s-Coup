import { Injectable } from '@nestjs/common';
import { GameRoom, Player } from './dto/game-events.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameRoomService {
  private rooms: Map<string, GameRoom> = new Map();
  private playerRoomMap: Map<string, string> = new Map(); // socketId -> roomId

  createRoom(playerName: string, socketId: string, maxPlayers: number, isPrivate: boolean): GameRoom {
    const roomId = uuidv4().substring(0, 8);
    
    const player: Player = {
      id: uuidv4(),
      name: playerName,
      socketId,
      isReady: false,
      coins: 2,
      cards: [],
      isAlive: true,
    };

    const room: GameRoom = {
      id: roomId,
      players: [player],
      maxPlayers,
      isPrivate,
      status: 'waiting',
      currentTurn: 0,
      phase: 'setup',
      deck: [],
      log: [],
      createdAt: new Date(),
    };

    this.rooms.set(roomId, room);
    this.playerRoomMap.set(socketId, roomId);

    return room;
  }

  joinRoom(roomId: string, playerName: string, socketId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    
    if (!room || room.status !== 'waiting' || room.players.length >= room.maxPlayers) {
      return null;
    }

    const player: Player = {
      id: uuidv4(),
      name: playerName,
      socketId,
      isReady: false,
      coins: 2,
      cards: [],
      isAlive: true,
    };

    room.players.push(player);
    this.playerRoomMap.set(socketId, roomId);

    return room;
  }

  leaveRoom(socketId: string): { roomId: string; room: GameRoom | null } | null {
    const roomId = this.playerRoomMap.get(socketId);
    
    if (!roomId) {
      return null;
    }

    const room = this.rooms.get(roomId);
    
    if (!room) {
      return null;
    }

    room.players = room.players.filter(p => p.socketId !== socketId);
    this.playerRoomMap.delete(socketId);

    // Se a sala ficou vazia, remove ela
    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return { roomId, room: null };
    }

    return { roomId, room };
  }

  setPlayerReady(roomId: string, playerId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return null;
    }

    const player = room.players.find(p => p.id === playerId);
    
    if (player) {
      player.isReady = !player.isReady;
    }

    return room;
  }

  startGame(roomId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    
    if (!room || room.status !== 'waiting') {
      return null;
    }

    // Verifica se todos os jogadores estão prontos
    if (!room.players.every(p => p.isReady)) {
      return null;
    }

    // Distribui as cartas (cada jogador recebe 2 cartas)
    const deck = this.createDeck();
    room.players.forEach(player => {
      player.cards = [
        { character: deck.pop()!, revealed: false },
        { character: deck.pop()!, revealed: false }
      ];
      player.coins = 2;
    });

    room.deck = deck; // Guarda o resto do deck
    room.status = 'playing';
    room.phase = 'action';
    room.currentTurn = 0;
    room.log = ['O jogo começou!'];

    return room;
  }

  getRoom(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  getRoomBySocketId(socketId: string): GameRoom | undefined {
    const roomId = this.playerRoomMap.get(socketId);
    return roomId ? this.rooms.get(roomId) : undefined;
  }

  getAllRooms(): GameRoom[] {
    return Array.from(this.rooms.values()).filter(room => 
      !room.isPrivate && room.status === 'waiting'
    );
  }

  private createDeck(): string[] {
    const characters = ['Duke', 'Assassin', 'Captain', 'Ambassador', 'Contessa'];
    const deck: string[] = [];
    
    // 3 de cada personagem = 15 cartas
    characters.forEach(char => {
      deck.push(char, char, char);
    });

    // Embaralha
    return deck.sort(() => Math.random() - 0.5);
  }

  nextTurn(roomId: string): GameRoom | null {
    const room = this.rooms.get(roomId);
    
    if (!room || room.status !== 'playing') {
      return null;
    }

    // Avança para o próximo jogador vivo
    do {
      room.currentTurn = (room.currentTurn + 1) % room.players.length;
    } while (!room.players[room.currentTurn].isAlive);

    return room;
  }

  updatePendingAction(roomId: string, action: GameRoom['pendingAction']): GameRoom | null {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return null;
    }

    room.pendingAction = action;
    return room;
  }
}
