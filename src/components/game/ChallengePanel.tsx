import { Player, GameAction } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CHARACTERS } from '@/assets/characters';
import { AlertTriangle, Check } from 'lucide-react';

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
    <div className="challenge-panel p-6 rounded-xl space-y-4">
      <div className="text-center">
        <h3 className="text-game-gold font-bold text-xl flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Contestar?
        </h3>
        <p className="text-muted-foreground mt-2">
          <span className="text-foreground font-semibold">{actor.name}</span> alega ser{' '}
          <span className="text-game-gold">{character.emoji} {character.namePortuguese}</span>
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-center text-muted-foreground">
          Quem quer contestar?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {eligibleChallengers.map(player => (
            <Button
              key={player.id}
              onClick={() => onChallenge(player.id)}
              variant="destructive"
              className="w-full"
            >
              🔍 {player.name} Contesta!
            </Button>
          ))}
        </div>
      </div>

      <Button onClick={onSkip} variant="outline" className="w-full">
        <Check className="w-4 h-4 mr-2" />
        Ninguém Contesta
      </Button>
    </div>
  );
};
