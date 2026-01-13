import { Player } from '@/types/game';
import { CHARACTERS } from '@/assets/characters';
import { cn } from '@/lib/utils';
import { Coins } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer: boolean;
  onSelect?: () => void;
  selectable?: boolean;
}

export const PlayerCard = ({ player, isCurrentPlayer, onSelect, selectable }: PlayerCardProps) => {
  return (
    <div
      onClick={selectable && player.isAlive ? onSelect : undefined}
      className={cn(
        'game-card p-4 rounded-xl transition-all duration-300',
        isCurrentPlayer && 'ring-2 ring-game-gold ring-offset-2 ring-offset-game-dark',
        !player.isAlive && 'opacity-50 grayscale',
        selectable && player.isAlive && 'cursor-pointer hover:scale-105 hover:ring-2 hover:ring-game-gold/50',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn(
          'font-bold text-lg',
          isCurrentPlayer ? 'text-game-gold' : 'text-foreground'
        )}>
          {player.name}
          {isCurrentPlayer && <span className="ml-2 text-xs">🎯</span>}
        </h3>
        <div className="flex items-center gap-1 bg-game-gold/20 px-2 py-1 rounded-full">
          <Coins className="w-4 h-4 text-game-gold" />
          <span className="text-game-gold font-bold">{player.coins}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {player.cards.map((card, index) => (
          <div
            key={index}
            className={cn(
              'flex-1 h-20 rounded-lg flex items-center justify-center text-2xl transition-all duration-500',
              card.revealed
                ? 'bg-gradient-to-br from-game-blood/30 to-game-dark border border-game-blood/50'
                : 'bg-gradient-to-br from-game-purple/50 to-game-dark border border-game-gold/30 card-back'
            )}
          >
            {card.revealed ? (
              <div className="text-center">
                <div className="text-2xl">{CHARACTERS[card.character].emoji}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {CHARACTERS[card.character].namePortuguese}
                </div>
              </div>
            ) : (
              <span className="text-game-gold/50">?</span>
            )}
          </div>
        ))}
      </div>

      {!player.isAlive && (
        <div className="mt-2 text-center text-game-blood text-sm font-semibold">
          ☠️ Exilado
        </div>
      )}
    </div>
  );
};
