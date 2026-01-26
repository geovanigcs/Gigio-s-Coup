import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGameSocket } from '@/hooks/useGameSocket';
import { GameBoard } from '@/components/game/GameBoard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { adaptServerToClient, getLocalPlayerId, isLocalPlayerTurn } from '@/lib/gameAdapter';
import { toast } from 'sonner';

const GameOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    connected, 
    room, 
    socket,
    performAction, 
    challengeAction, 
    blockAction, 
    loseInfluence, 
    passAction 
  } = useGameSocket();
  
  const [isLoading, setIsLoading] = useState(true);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);

  useEffect(() => {
    // Espera um pouco para garantir que o room foi carregado
    const timer = setTimeout(() => {
      if (!room) {
        console.log('Sem dados da sala, redirecionando para lobby');
        navigate('/game/lobby');
        return;
      }

      if (room.status !== 'playing') {
        console.log('Jogo ainda não iniciado, redirecionando para lobby');
        navigate('/game/lobby');
        return;
      }

      // Identifica o jogador local
      if (socket) {
        const playerId = getLocalPlayerId(room, socket.id);
        setLocalPlayerId(playerId);
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [room, navigate, socket]);

  useEffect(() => {
    if (!connected) {
      toast.error('Conexão perdida com o servidor');
    }
  }, [connected]);

  // Verifica se o jogo terminou
  useEffect(() => {
    if (room && room.phase === 'game_over') {
      // O GameBoard vai exibir a tela de vitória
    }
  }, [room]);

  const handleAction = (action: string, targetId?: string) => {
    if (!room || !localPlayerId) return;
    
    // Verifica se é o turno do jogador
    if (!isLocalPlayerTurn(room, socket?.id || '')) {
      toast.error('Não é seu turno!');
      return;
    }

    performAction(room.id, localPlayerId, action, targetId);
  };

  const handleChallenge = (challengerId: string) => {
    if (!room || !localPlayerId) return;
    
    // No modo online, o challengerId é o ID do jogador que está desafiando (local)
    // E precisamos desafiar o jogador que fez a ação pendente
    if (room.pendingAction) {
      challengeAction(room.id, localPlayerId, room.pendingAction.playerId);
    }
  };

  const handleSkipChallenge = () => {
    if (!room) return;
    passAction(room.id);
  };

  const handleBlock = (blockerId: string, character: { name: string }) => {
    if (!room || !localPlayerId) return;
    blockAction(room.id, localPlayerId, character.name);
  };

  const handleSkipBlock = () => {
    if (!room) return;
    passAction(room.id);
  };

  const handleAcceptBlock = () => {
    if (!room) return;
    passAction(room.id);
  };

  const handleLoseInfluence = (playerId: string, cardIndex: number) => {
    if (!room || !localPlayerId) return;
    loseInfluence(room.id, playerId, cardIndex);
  };

  const handleEndTurn = () => {
    if (!room) return;
    passAction(room.id);
  };

  const handleReset = () => {
    if (window.confirm('Deseja sair da partida?')) {
      navigate('/game/lobby');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-purple-500/30">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Carregando jogo...</h2>
            <p className="text-gray-400 text-center">
              Conectando ao servidor e sincronizando estado do jogo.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 border-purple-500/30">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <h2 className="text-2xl font-bold text-white">Erro ao carregar jogo</h2>
            <p className="text-gray-400 text-center">
              Não foi possível carregar o estado do jogo. Por favor, tente novamente.
            </p>
            <Button 
              onClick={() => navigate('/game/lobby')}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Lobby
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gameState = adaptServerToClient(room);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900"
    >
      {/* Indicador de conexão */}
      {!connected && (
        <div className="absolute top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-red-500/20 border-red-500/50 backdrop-blur-sm">
              <CardContent className="p-3 flex items-center gap-2">
                <WifiOff className="w-5 h-5 text-red-300" />
                <p className="text-red-200 text-sm font-semibold">
                  Conexão perdida
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Indicador de turno */}
      {localPlayerId && isLocalPlayerTurn(room, socket?.id || '') && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border-2 border-green-500 rounded-full px-6 py-2 backdrop-blur-sm"
          >
            <p className="text-green-200 font-bold text-center">
              ✨ Seu Turno!
            </p>
          </motion.div>
        </div>
      )}

      <GameBoard
        gameState={gameState}
        onAction={handleAction}
        onChallenge={handleChallenge}
        onSkipChallenge={handleSkipChallenge}
        onBlock={handleBlock}
        onSkipBlock={handleSkipBlock}
        onAcceptBlock={handleAcceptBlock}
        onLoseInfluence={handleLoseInfluence}
        onEndTurn={handleEndTurn}
        onReset={handleReset}
      />
    </motion.div>
  );
};

export default GameOnline;
