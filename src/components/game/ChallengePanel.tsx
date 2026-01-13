import { motion } from 'framer-motion';
import { Player, GameAction } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CHARACTERS } from '@/assets/characters';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ChallengePanelProps {
  action: GameAction;
  players: Player[];
  onChallenge: (challengerId: string) => void;
  onSkip: () => void;
}

export const ChallengePanel = ({ action, players, onChallenge, onSkip }: ChallengePanelProps) => {
  const actor = players.find(p => p.id === action.playerId);
  const eligibleChallengers = players.filter(p => p.id !== action.playerId && p.isAlive);

  if (!actor || !action.requiredCharacter) return null;

  const character = CHARACTERS[action.requiredCharacter];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="challenge-panel p-6 rounded-2xl space-y-5"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <AlertTriangle className="w-12 h-12 text-game-gold mx-auto mb-3" />
        </motion.div>
        <h3 className="text-game-gold font-bold text-2xl">
          Contestar?
        </h3>
        <p className="text-muted-foreground mt-3 text-lg">
          <span className="text-foreground font-semibold">{actor.name}</span> alega ser
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <img 
            src={character.image} 
            alt={character.namePortuguese}
            className="w-12 h-12 rounded-lg object-cover ring-2 ring-game-gold/50"
          />
          <span className="text-game-gold text-xl font-bold">{character.namePortuguese}</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-center text-muted-foreground">
          Quem quer contestar? (Se errar, perde uma influência!)
        </p>
        <div className="grid grid-cols-1 gap-2">
          {eligibleChallengers.map(player => (
            <motion.div key={player.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onChallenge(player.id)}
                variant="destructive"
                className="w-full h-12 text-base"
              >
                <X className="w-4 h-4 mr-2" />
                {player.name}: "É mentira!"
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button onClick={onSkip} variant="outline" className="w-full h-12">
          <Check className="w-4 h-4 mr-2" />
          Ninguém Contesta - Continuar
        </Button>
      </motion.div>
    </motion.div>
  );
};
