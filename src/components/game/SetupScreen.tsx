import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Play, Crown, Swords } from 'lucide-react';
import { CHARACTERS } from '@/assets/characters';

interface SetupScreenProps {
  onStart: (playerNames: string[]) => void;
}

export const SetupScreen = ({ onStart }: SetupScreenProps) => {
  const [playerNames, setPlayerNames] = useState<string[]>(['Jogador 1', 'Jogador 2']);

  const addPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, `Jogador ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = () => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.slice(0, -1));
    }
  };

  const updateName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <Crown className="w-10 h-10 text-game-gold animate-pulse-glow" />
            <Swords className="w-8 h-8 text-game-blood" />
          </div>
          <h1 className="text-4xl font-bold text-game-gold tracking-wider">
            GIGIO'S MINIGAME
          </h1>
          <p className="text-muted-foreground text-sm">
            Um jogo de blefe, intriga e traição
          </p>
        </div>

        {/* Character Preview */}
        <div className="flex justify-center gap-2">
          {Object.values(CHARACTERS).map(char => (
            <div
              key={char.id}
              className="w-12 h-16 rounded-lg game-card flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-default"
              title={char.namePortuguese}
            >
              {char.emoji}
            </div>
          ))}
        </div>

        {/* Player Setup */}
        <div className="game-card p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Jogadores</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={removePlayer}
                disabled={playerNames.length <= 2}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={addPlayer}
                disabled={playerNames.length >= 6}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {playerNames.map((name, index) => (
              <Input
                key={index}
                value={name}
                onChange={(e) => updateName(index, e.target.value)}
                placeholder={`Jogador ${index + 1}`}
                className="bg-background/50"
              />
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={() => onStart(playerNames)}
          className="w-full h-14 text-lg font-bold btn-gold"
        >
          <Play className="w-5 h-5 mr-2" />
          Iniciar Jogo
        </Button>

        {/* Rules Summary */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Cada jogador começa com 2 moedas e 2 cartas de influência.
          </p>
          <p className="text-xs text-muted-foreground">
            O último com influência vence! 👑
          </p>
        </div>
      </div>
    </div>
  );
};
