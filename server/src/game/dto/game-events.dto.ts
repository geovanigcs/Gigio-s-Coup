export type GameAction = 
  | 'income' 
  | 'foreign_aid' 
  | 'coup' 
  | 'tax' 
  | 'assassinate' 
  | 'exchange' 
  | 'steal';

export type Character = 
  | 'duke' 
  | 'assassin' 
  | 'contessa' 
  | 'captain' 
  | 'ambassador';

export interface CreateRoomDto {
  playerName: string;
  maxPlayers: number;
  isPrivate: boolean;
}

export interface JoinRoomDto {
  roomId: string;
  playerName: string;
}

export interface PlayerReadyDto {
  roomId: string;
  playerId: string;
}

export interface GameActionDto {
  roomId: string;
  playerId: string;
  action: GameAction;
  targetId?: string;
  claimedCharacter?: Character;
}

export interface ChallengeActionDto {
  roomId: string;
  playerId: string;
  challengedPlayerId: string;
}

export interface BlockActionDto {
  roomId: string;
  playerId: string;
  claimedCharacter?: Character;
  blockWith?: string; // Manter compatibilidade
}

export interface LoseInfluenceDto {
  roomId: string;
  playerId: string;
  cardIndex: number;
}

export interface Player {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  coins: number;
  cards: Array<{ character: string; revealed: boolean }>;
  isAlive: boolean;
}

export type GamePhase = 
  | 'setup' 
  | 'action' 
  | 'challenge' 
  | 'block' 
  | 'block_challenge' 
  | 'lose_influence' 
  | 'exchange' 
  | 'game_over';

export interface GameRoom {
  id: string;
  players: Player[];
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
    claimedCharacter?: Character;
    requiredCharacter?: string;
  };
  pendingBlock?: {
    blockerId: string;
    blockType: string;
    character: string;
  } | null;
  winner?: Player | null;
  log: string[];
  lastAction?: string;
  createdAt: Date;
}
