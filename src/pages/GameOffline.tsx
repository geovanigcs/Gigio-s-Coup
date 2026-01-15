import { SetupScreen } from '@/components/game/SetupScreen';
import { GameBoard } from '@/components/game/GameBoard';
import { useGameState } from '@/hooks/useGameState';

const GameOffline = () => {
  const {
    gameState,
    startGame,
    performAction,
    challenge,
    skipChallenge,
    blockAction,
    skipBlock,
    acceptBlock,
    loseInfluence,
    endTurn,
    resetGame,
  } = useGameState();

  if (!gameState) {
    return <SetupScreen onStart={startGame} />;
  }

  return (
    <GameBoard
      gameState={gameState}
      onAction={performAction}
      onChallenge={challenge}
      onSkipChallenge={skipChallenge}
      onBlock={blockAction}
      onSkipBlock={skipBlock}
      onAcceptBlock={acceptBlock}
      onLoseInfluence={loseInfluence}
      onEndTurn={endTurn}
      onReset={resetGame}
    />
  );
};

export default GameOffline;
