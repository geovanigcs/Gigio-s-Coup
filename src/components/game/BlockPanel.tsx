import { motion } from 'framer-motion';
import { Player, GameAction } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CHARACTERS, CharacterType } from '@/assets/characters';
import { Shield, Check } from 'lucide-react';

interface BlockPanelProps {
  action: GameAction;
  players: Player[];
  onBlock: (blockerId: string, character: CharacterType) => void;
  onSkip: () => void;
}

export const BlockPanel = ({ action, players, onBlock, onSkip }: BlockPanelProps) => {
  const actor = players.find(p => p.id === action.playerId);
  const target = action.targetId ? players.find(p => p.id === action.targetId) : null;
  const eligibleBlockers = players.filter(p => p.id !== action.playerId && p.isAlive);

  const getBlockOptions = (): { character: CharacterType; label: string }[] => {
    switch (action.type) {
      case 'foreign_aid':
        return [{ character: 'duke', label: 'Duque bloqueia' }];
      case 'assassinate':
        return [{ character: 'contessa', label: 'Condessa bloqueia' }];
      case 'steal':
        return [
          { character: 'captain', label: 'Capitão bloqueia' },
          { character: 'ambassador', label: 'Embaixador bloqueia' },
        ];
      default:
        return [];
    }
  };

  const blockOptions = getBlockOptions();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="block-panel p-6 rounded-2xl space-y-5"
    >
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Shield className="w-12 h-12 text-game-royal mx-auto mb-3" />
        </motion.div>
        <h3 className="text-game-gold font-bold text-2xl">
          Bloquear?
        </h3>
        <p className="text-muted-foreground mt-3 text-lg">
          <span className="text-foreground font-semibold">{actor?.name}</span>
          {action.type === 'foreign_aid' && ' quer pegar 2 moedas'}
          {action.type === 'assassinate' && ` quer assassinar ${target?.name}`}
          {action.type === 'steal' && ` quer roubar de ${target?.name}`}
        </p>
      </div>

      <div className="space-y-4">
        {eligibleBlockers.map(player => (
          <div key={player.id} className="space-y-2">
            <p className="text-sm text-muted-foreground font-semibold">{player.name}:</p>
            <div className="grid grid-cols-1 gap-2">
              {blockOptions.map(option => {
                const char = CHARACTERS[option.character];
                return (
                  <motion.div key={`${player.id}-${option.character}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => onBlock(player.id, option.character)}
                      variant="secondary"
                      className="w-full h-12 justify-start gap-3"
                    >
                      <img 
                        src={char.image} 
                        alt={char.namePortuguese}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                      {option.label}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button onClick={onSkip} variant="outline" className="w-full h-12">
          <Check className="w-4 h-4 mr-2" />
          Ninguém Bloqueia - Continuar
        </Button>
      </motion.div>
    </motion.div>
  );
};
