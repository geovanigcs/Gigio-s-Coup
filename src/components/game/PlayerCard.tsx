import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types/game';
import { CHARACTERS, CARD_BACK_IMAGE } from '@/assets/characters';
import { cn } from '@/lib/utils';
import { Coins, Eye, EyeOff } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  isViewingPlayer: boolean;
  onSelect?: () => void;
  selectable?: boolean;
}

export const PlayerCard = ({ 
  player, 
  isCurrentPlayer, 
  isViewingPlayer,
  onSelect, 
  selectable 
}: PlayerCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={selectable && player.isAlive ? onSelect : undefined}
      className={cn(
        'game-card p-4 rounded-2xl transition-all duration-300 relative overflow-hidden',
        isCurrentPlayer && 'ring-2 ring-game-gold ring-offset-2 ring-offset-game-dark shadow-[0_0_30px_rgba(212,175,55,0.3)]',
        !player.isAlive && 'opacity-40 grayscale',
        selectable && player.isAlive && 'cursor-pointer hover:scale-[1.02] hover:ring-2 hover:ring-game-gold/50',
      )}
    >
      {/* Glow effect for current player */}
      {isCurrentPlayer && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-game-gold/10 to-transparent pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              'font-bold text-lg',
              isCurrentPlayer ? 'text-game-gold' : 'text-foreground'
            )}>
              {player.name}
            </h3>
            {isCurrentPlayer && (
              <motion.span 
                className="text-xs bg-game-gold/20 text-game-gold px-2 py-0.5 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Sua vez
              </motion.span>
            )}
          </div>
          <motion.div 
            className="flex items-center gap-1 bg-game-gold/20 px-3 py-1.5 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Coins className="w-4 h-4 text-game-gold" />
            <span className="text-game-gold font-bold text-lg">{player.coins}</span>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="flex gap-3 justify-center">
          <AnimatePresence mode="wait">
            {player.cards.map((card, index) => {
              const character = CHARACTERS[card.character];
              const shouldShowCard = card.revealed || isViewingPlayer;
              
              return (
                <motion.div
                  key={index}
                  initial={{ rotateY: 180, opacity: 0 }}
                  animate={{ 
                    rotateY: shouldShowCard ? 0 : 180, 
                    opacity: 1,
                    scale: card.revealed ? 0.95 : 1
                  }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className={cn(
                    'relative w-24 h-36 rounded-xl overflow-hidden shadow-xl',
                    card.revealed && 'ring-2 ring-game-blood/50'
                  )}
                  style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                >
                  {/* Card Front */}
                  <div 
                    className={cn(
                      'absolute inset-0 backface-hidden transition-all duration-300',
                      !shouldShowCard && 'invisible'
                    )}
                  >
                    <img 
                      src={character.image} 
                      alt={character.namePortuguese}
                      className={cn(
                        'w-full h-full object-cover',
                        card.revealed && 'grayscale opacity-60'
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                      <p className="text-white text-xs font-bold drop-shadow-lg">
                        {character.namePortuguese}
                      </p>
                    </div>
                    {card.revealed && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="text-3xl">☠️</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Back */}
                  <div 
                    className={cn(
                      'absolute inset-0 backface-hidden',
                      shouldShowCard && 'invisible'
                    )}
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <img 
                      src={CARD_BACK_IMAGE} 
                      alt="Card back"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Viewing indicator */}
        <div className="mt-3 flex justify-center">
          {isViewingPlayer ? (
            <span className="text-xs text-game-gold flex items-center gap-1">
              <Eye className="w-3 h-3" /> Suas cartas
            </span>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <EyeOff className="w-3 h-3" /> Cartas ocultas
            </span>
          )}
        </div>

        {!player.isAlive && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center text-game-blood text-sm font-semibold"
          >
            ☠️ Exilado
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
