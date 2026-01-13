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
    <div className="lose-influence-panel p-6 rounded-xl space-y-4">
      <div className="text-center">
        <h3 className="text-game-blood font-bold text-xl flex items-center justify-center gap-2">
          <Skull className="w-5 h-5" />
          {player.name}, perca uma influência!
        </h3>
        <p className="text-muted-foreground mt-2">
          Escolha qual carta revelar
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {availableCards.map(({ card, index }) => (
          <Button
            key={index}
            onClick={() => onChoose(index)}
            variant="outline"
            className="h-24 flex flex-col gap-2 hover:bg-game-blood/20 hover:border-game-blood transition-all"
          >
            <span className="text-3xl">{CHARACTERS[card.character].emoji}</span>
            <span className="text-sm">{CHARACTERS[card.character].namePortuguese}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
