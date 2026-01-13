// Character definitions for the game
import dukeImg from '@/assets/characters/duke.png';
import assassinImg from '@/assets/characters/assassin.png';
import contessaImg from '@/assets/characters/contessa.png';
import captainImg from '@/assets/characters/captain.png';
import ambassadorImg from '@/assets/characters/ambassador.png';
import cardBackImg from '@/assets/characters/card-back.png';

export type CharacterType = 'duke' | 'assassin' | 'contessa' | 'captain' | 'ambassador';

export interface Character {
  id: CharacterType;
  name: string;
  namePortuguese: string;
  color: string;
  emoji: string;
  image: string;
  actions: string[];
  blocks: string[];
}

export const CARD_BACK_IMAGE = cardBackImg;

export const CHARACTERS: Record<CharacterType, Character> = {
  duke: {
    id: 'duke',
    name: 'Duke',
    namePortuguese: 'Duque',
    color: 'hsl(270, 70%, 50%)',
    emoji: '👑',
    image: dukeImg,
    actions: ['Pegar 3 moedas (Taxar)'],
    blocks: ['Ajuda Externa'],
  },
  assassin: {
    id: 'assassin',
    name: 'Assassin',
    namePortuguese: 'Assassino',
    color: 'hsl(0, 70%, 40%)',
    emoji: '🗡️',
    image: assassinImg,
    actions: ['Pagar 3 moedas para assassinar'],
    blocks: [],
  },
  contessa: {
    id: 'contessa',
    name: 'Contessa',
    namePortuguese: 'Condessa',
    color: 'hsl(330, 70%, 50%)',
    emoji: '👸',
    image: contessaImg,
    actions: [],
    blocks: ['Assassinato'],
  },
  captain: {
    id: 'captain',
    name: 'Captain',
    namePortuguese: 'Capitão',
    color: 'hsl(200, 70%, 45%)',
    emoji: '⚓',
    image: captainImg,
    actions: ['Roubar 2 moedas de outro jogador'],
    blocks: ['Roubo'],
  },
  ambassador: {
    id: 'ambassador',
    name: 'Ambassador',
    namePortuguese: 'Embaixador',
    color: 'hsl(150, 60%, 40%)',
    emoji: '🎭',
    image: ambassadorImg,
    actions: ['Trocar cartas com o Deck da Corte'],
    blocks: ['Roubo'],
  },
};

export const createDeck = (): CharacterType[] => {
  const deck: CharacterType[] = [];
  const characters: CharacterType[] = ['duke', 'assassin', 'contessa', 'captain', 'ambassador'];
  
  characters.forEach(char => {
    for (let i = 0; i < 3; i++) {
      deck.push(char);
    }
  });
  
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: CharacterType[]): CharacterType[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};
