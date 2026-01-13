import { CharacterType } from '@/assets/characters';

export interface Card {
  character: CharacterType;
  revealed: boolean;
}

export interface Player {
  id: string;
  name: string;
  coins: number;
  cards: Card[];
  isAlive: boolean;
}

export type ActionType = 
  | 'income' 
  | 'foreign_aid' 
  | 'coup' 
  | 'tax' 
  | 'assassinate' 
  | 'steal' 
  | 'exchange';

export type BlockType = 'duke_block' | 'contessa_block' | 'captain_block' | 'ambassador_block';

export interface GameAction {
  type: ActionType;
  playerId: string;
  targetId?: string;
  canBeBlocked: boolean;
  canBeChallenged: boolean;
  requiredCharacter?: CharacterType;
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

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: CharacterType[];
  phase: GamePhase;
  currentAction: GameAction | null;
  pendingBlock: {
    blockerId: string;
    blockType: BlockType;
    character: CharacterType;
  } | null;
  winner: Player | null;
  log: string[];
}
