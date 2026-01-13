import { motion } from 'framer-motion';
import { Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CHARACTERS } from '@/assets/characters';
import { Skull } from 'lucide-react';

interface LoseInfluencePanelProps {
  player: Player;
  onChoose: (cardIndex: number) => void;
}

export const LoseInfluencePanel = ({ player, onChoose }: LoseInfluencePanelProps) => {
  const availableCards = player.cards
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => !card.revealed);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="lose-influence-panel p-6 rounded-2xl space-y-5"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Skull className="w-14 h-14 text-game-blood mx-auto mb-3" />
        </motion.div>
        <h3 className="text-game-blood font-bold text-2xl">
          {player.name}, perca uma influência!
        </h3>
        <p className="text-muted-foreground mt-2">
          Escolha qual carta revelar
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {availableCards.map(({ card, index }) => {
          const character = CHARACTERS[card.character];
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onChoose(index)}
                variant="outline"
                className="w-full h-40 flex flex-col gap-2 p-2 hover:bg-game-blood/20 hover:border-game-blood transition-all"
              >
                <img 
                  src={character.image} 
                  alt={character.namePortuguese}
                  className="w-full h-24 rounded-lg object-cover"
                />
                <span className="text-sm font-bold">{character.namePortuguese}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
