import { GameState, Player } from '@/types/game';
import { PlayerCard } from './PlayerCard';
import { ActionPanel } from './ActionPanel';
import { ChallengePanel } from './ChallengePanel';
import { BlockPanel } from './BlockPanel';
import { LoseInfluencePanel } from './LoseInfluencePanel';
import { GameLog } from './GameLog';
import { Button } from '@/components/ui/button';
import { Crown, RotateCcw, Coins } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  onAction: (action: string, targetId?: string) => void;
  onChallenge: (challengerId: string) => void;
  onSkipChallenge: () => void;
  onBlock: (blockerId: string, character: any) => void;
  onSkipBlock: () => void;
  onAcceptBlock: () => void;
  onLoseInfluence: (playerId: string, cardIndex: number) => void;
  onReset: () => void;
}

export const GameBoard = ({
  gameState,
  onAction,
  onChallenge,
  onSkipChallenge,
  onBlock,
  onSkipBlock,
  onAcceptBlock,
  onLoseInfluence,
  onReset,
}: GameBoardProps) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const mustCoup = currentPlayer.coins >= 10;

  // Find the player who needs to lose influence
  const getLoseInfluencePlayer = (): Player | null => {
    if (gameState.phase !== 'lose_influence' || !gameState.currentAction) return null;
    
    const targetId = gameState.currentAction.targetId;
    return gameState.players.find(p => p.id === targetId) || null;
  };

  const loseInfluencePlayer = getLoseInfluencePlayer();

  if (gameState.phase === 'game_over' && gameState.winner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <Crown className="w-20 h-20 text-game-gold mx-auto animate-bounce" />
          <h1 className="text-4xl font-bold text-game-gold">
            {gameState.winner.name} Venceu!
          </h1>
          <p className="text-muted-foreground">
            O último sobrevivente da corte!
          </p>
          <Button onClick={onReset} className="btn-gold">
            <RotateCcw className="w-4 h-4 mr-2" />
            Jogar Novamente
          </Button>
          <GameLog log={gameState.log} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-game-gold flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Gigio's Minigame
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="w-4 h-4 text-game-gold" />
              Tesouro: ∞
            </div>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gameState.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentPlayer={player.id === currentPlayer.id && gameState.phase === 'action'}
            />
          ))}
        </div>

        {/* Action Area */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            {gameState.phase === 'action' && (
              <ActionPanel
                currentPlayer={currentPlayer}
                players={gameState.players}
                onAction={onAction}
                mustCoup={mustCoup}
              />
            )}

            {gameState.phase === 'challenge' && gameState.currentAction && (
              <ChallengePanel
                action={gameState.currentAction}
                players={gameState.players}
                onChallenge={onChallenge}
                onSkip={onSkipChallenge}
              />
            )}

            {gameState.phase === 'block' && gameState.currentAction && (
              <BlockPanel
                action={gameState.currentAction}
                players={gameState.players}
                onBlock={onBlock}
                onSkip={onSkipBlock}
              />
            )}

            {gameState.phase === 'block_challenge' && gameState.pendingBlock && (
              <div className="challenge-panel p-6 rounded-xl space-y-4">
                <h3 className="text-game-gold font-bold text-center">
                  Contestar o bloqueio?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {gameState.players
                    .filter(p => p.id !== gameState.pendingBlock?.blockerId && p.isAlive)
                    .map(player => (
                      <Button
                        key={player.id}
                        onClick={() => onChallenge(player.id)}
                        variant="destructive"
                      >
                        {player.name} Contesta
                      </Button>
                    ))}
                </div>
                <Button onClick={onAcceptBlock} variant="outline" className="w-full">
                  Aceitar Bloqueio
                </Button>
              </div>
            )}

            {gameState.phase === 'lose_influence' && loseInfluencePlayer && (
              <LoseInfluencePanel
                player={loseInfluencePlayer}
                onChoose={(cardIndex) => onLoseInfluence(loseInfluencePlayer.id, cardIndex)}
              />
            )}
          </div>

          <GameLog log={gameState.log} />
        </div>
      </div>
    </div>
  );
};
