import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Player } from '@/types/game';
import { PlayerCard } from './PlayerCard';
import { ActionPanel } from './ActionPanel';
import { ChallengePanel } from './ChallengePanel';
import { BlockPanel } from './BlockPanel';
import { LoseInfluencePanel } from './LoseInfluencePanel';
import { GameLog } from './GameLog';
import { Button } from '@/components/ui/button';
import { Crown, RotateCcw, Coins, ArrowLeft } from 'lucide-react';
import { CHARACTERS } from '@/assets/characters';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  onEndTurn: () => void;
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
  onEndTurn,
}: GameBoardProps) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const mustCoup = currentPlayer.coins >= 10;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    if (window.confirm('Deseja sair da partida? O progresso será perdido.')) {
      navigate(isAuthenticated ? '/dashboard' : '/');
    }
  };

  const getLoseInfluencePlayer = (): Player | null => {
    if (gameState.phase !== 'lose_influence' || !gameState.currentAction) return null;
    const targetId = gameState.currentAction.targetId;
    return gameState.players.find(p => p.id === targetId) || null;
  };

  const loseInfluencePlayer = getLoseInfluencePlayer();

  if (gameState.phase === 'game_over' && gameState.winner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* <Crown className="w-24 h-24 text-game-gold mx-auto" /> */}
          </motion.div>
          
          <div>
            <motion.h1 
              className="text-5xl font-bold text-game-gold"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(212,175,55,0.5)",
                  "0 0 60px rgba(212,175,55,0.8)",
                  "0 0 20px rgba(212,175,55,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {gameState.winner.name}
            </motion.h1>
            <p className="text-2xl text-foreground mt-2">Venceu!</p>
            <p className="text-muted-foreground mt-4">
              O último sobrevivente da corte!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {gameState.winner.cards.filter(c => !c.revealed).map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="w-20 h-28 rounded-xl overflow-hidden ring-2 ring-game-gold"
              >
                <img 
                  src={CHARACTERS[card.character].image} 
                  alt={CHARACTERS[card.character].namePortuguese}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button onClick={onReset} className="btn-gold h-14 px-8">
              <RotateCcw className="w-5 h-5 mr-2" />
              Jogar Novamente
            </Button>
          </motion.div>

          <GameLog log={gameState.log} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBack}
                variant="ghost"
                size="sm"
                className="text-game-gold hover:text-game-gold-light"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-game-gold flex items-center gap-2" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                <Crown className="w-7 h-7" />
                Gigio's Coup
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-3 py-1.5 rounded-full">
                <Coins className="w-4 h-4 text-game-gold" />
                Tesouro: ∞
              </div>
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Current Player Indicator */}
          <motion.div 
            className="text-center py-3 bg-game-gold/10 rounded-xl border border-game-gold/30"
            animate={{ 
              borderColor: ["rgba(212,175,55,0.3)", "rgba(212,175,55,0.6)", "rgba(212,175,55,0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-game-gold font-semibold">
              Vez de: <span className="text-xl">{currentPlayer.name}</span>
            </p>
          </motion.div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameState.players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isCurrentPlayer={player.id === currentPlayer.id && gameState.phase === 'action'}
                isViewingPlayer={player.id === currentPlayer.id}
              />
            ))}
          </div>

          {/* Action Area */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {gameState.phase === 'action' && (
                  <motion.div
                    key="action"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ActionPanel
                      currentPlayer={currentPlayer}
                      players={gameState.players}
                      onAction={onAction}
                      mustCoup={mustCoup}
                    />
                  </motion.div>
                )}

                {gameState.phase === 'challenge' && gameState.currentAction && (
                  <motion.div
                    key="challenge"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ChallengePanel
                      action={gameState.currentAction}
                      players={gameState.players}
                      onChallenge={onChallenge}
                      onSkip={onSkipChallenge}
                    />
                  </motion.div>
                )}

                {gameState.phase === 'block' && gameState.currentAction && (
                  <motion.div
                    key="block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <BlockPanel
                      action={gameState.currentAction}
                      players={gameState.players}
                      onBlock={onBlock}
                      onSkip={onSkipBlock}
                    />
                  </motion.div>
                )}

                {gameState.phase === 'block_challenge' && gameState.pendingBlock && (
                  <motion.div
                    key="block_challenge"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="challenge-panel p-6 rounded-2xl space-y-4"
                  >
                    <h3 className="text-game-gold font-bold text-center text-xl">
                      Contestar o bloqueio?
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {gameState.players
                        .filter(p => p.id !== gameState.pendingBlock?.blockerId && p.isAlive)
                        .map(player => (
                          <motion.div key={player.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => onChallenge(player.id)}
                              variant="destructive"
                              className="w-full h-12"
                            >
                              {player.name}: "É mentira!"
                            </Button>
                          </motion.div>
                        ))}
                    </div>
                    <Button onClick={onAcceptBlock} variant="outline" className="w-full h-12">
                      Aceitar Bloqueio
                    </Button>
                  </motion.div>
                )}

                {gameState.phase === 'lose_influence' && loseInfluencePlayer && (
                  <motion.div
                    key="lose_influence"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <LoseInfluencePanel
                      player={loseInfluencePlayer}
                      onChoose={(cardIndex) => onLoseInfluence(loseInfluencePlayer.id, cardIndex)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <GameLog log={gameState.log} />
            </div>
          </div>
        </div>
      </div>
  );
};
