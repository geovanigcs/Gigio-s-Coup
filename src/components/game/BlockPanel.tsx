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
        return [{ character: 'duke', label: '👑 Duque bloqueia' }];
      case 'assassinate':
        return [{ character: 'contessa', label: '👸 Condessa bloqueia' }];
      case 'steal':
        return [
          { character: 'captain', label: '⚓ Capitão bloqueia' },
          { character: 'ambassador', label: '🎭 Embaixador bloqueia' },
        ];
      default:
        return [];
    }
  };

  const blockOptions = getBlockOptions();

  return (
    <div className="block-panel p-6 rounded-xl space-y-4">
      <div className="text-center">
        <h3 className="text-game-gold font-bold text-xl flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          Bloquear?
        </h3>
        <p className="text-muted-foreground mt-2">
          <span className="text-foreground font-semibold">{actor?.name}</span>
          {action.type === 'foreign_aid' && ' quer pegar 2 moedas (Ajuda Externa)'}
          {action.type === 'assassinate' && ` quer assassinar ${target?.name}`}
          {action.type === 'steal' && ` quer roubar de ${target?.name}`}
        </p>
      </div>

      <div className="space-y-3">
        {eligibleBlockers.map(player => (
          <div key={player.id} className="space-y-2">
            <p className="text-sm text-muted-foreground">{player.name}:</p>
            <div className="grid grid-cols-2 gap-2">
              {blockOptions.map(option => (
                <Button
                  key={`${player.id}-${option.character}`}
                  onClick={() => onBlock(player.id, option.character)}
                  variant="secondary"
                  className="w-full text-sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onSkip} variant="outline" className="w-full">
        <Check className="w-4 h-4 mr-2" />
        Ninguém Bloqueia
      </Button>
    </div>
  );
};
