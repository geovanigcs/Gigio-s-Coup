import { GameState, Player as ClientPlayer, Card, GameAction, GamePhase } from '@/types/game';
import { CharacterType } from '@/assets/characters';

interface ServerPlayer {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  coins: number;
  cards: Array<{ character: string; revealed: boolean }>;
  isAlive: boolean;
}

interface ServerGameRoom {
  id: string;
  players: ServerPlayer[];
  maxPlayers: number;
  isPrivate: boolean;
  status: 'waiting' | 'playing' | 'finished';
  currentTurn: number;
  phase: GamePhase;
  deck: string[];
  pendingAction?: {
    type: string;
    playerId: string;
    targetId?: string;
    canBeBlocked: boolean;
    canBeChallenged: boolean;
    requiredCharacter?: string;
  };
  pendingBlock?: {
    blockerId: string;
    blockType: string;
    character: string;
  } | null;
  winner?: ServerPlayer | null;
  log: string[];
}

/**
 * Converte os dados do servidor (GameRoom) para o formato esperado pelo cliente (GameState)
 */
export function adaptServerToClient(room: ServerGameRoom): GameState {
  // Converte jogadores
  const players: ClientPlayer[] = room.players.map(serverPlayer => ({
    id: serverPlayer.id,
    name: serverPlayer.name,
    coins: serverPlayer.coins,
    cards: serverPlayer.cards.map(card => ({
      character: card.character as CharacterType,
      revealed: card.revealed
    })),
    isAlive: serverPlayer.isAlive
  }));

  // Converte ação pendente
  const currentAction: GameAction | null = room.pendingAction ? {
    type: room.pendingAction.type as 'income' | 'foreign_aid' | 'coup' | 'tax' | 'assassinate' | 'steal' | 'exchange',
    playerId: room.pendingAction.playerId,
    targetId: room.pendingAction.targetId,
    canBeBlocked: room.pendingAction.canBeBlocked,
    canBeChallenged: room.pendingAction.canBeChallenged,
    requiredCharacter: room.pendingAction.requiredCharacter as CharacterType | undefined
  } : null;

  // Converte bloqueio pendente
  const pendingBlock = room.pendingBlock ? {
    blockerId: room.pendingBlock.blockerId,
    blockType: room.pendingBlock.blockType as 'duke_block' | 'contessa_block' | 'captain_block' | 'ambassador_block',
    character: room.pendingBlock.character as CharacterType
  } : null;

  // Encontra vencedor
  const winner = room.winner ? players.find(p => p.id === room.winner!.id) || null : null;

  // Calcula o índice do jogador atual
  const currentPlayerIndex = room.players.findIndex((_, index) => index === room.currentTurn);

  return {
    players,
    currentPlayerIndex: currentPlayerIndex >= 0 ? currentPlayerIndex : 0,
    deck: room.deck.map(char => char as CharacterType),
    phase: room.phase,
    currentAction,
    pendingBlock,
    winner,
    log: room.log || []
  };
}

/**
 * Obtém o ID do jogador local baseado no socketId
 */
export function getLocalPlayerId(room: ServerGameRoom, socketId: string): string | null {
  const player = room.players.find(p => p.socketId === socketId);
  return player?.id || null;
}

/**
 * Verifica se é o turno do jogador local
 */
export function isLocalPlayerTurn(room: ServerGameRoom, socketId: string): boolean {
  const currentPlayer = room.players[room.currentTurn];
  return currentPlayer?.socketId === socketId;
}
