import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameSocket } from '@/hooks/useGameSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Users, Play, ArrowLeft, RefreshCw, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const GameLobby = () => {
  const navigate = useNavigate();
  const { connected, rooms, room, createRoom, joinRoom, getRooms, setPlayerReady, startGame } = useGameSocket();
  const [playerName, setPlayerName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');

  useEffect(() => {
    if (connected) {
      getRooms();
      const interval = setInterval(getRooms, 5000);
      return () => clearInterval(interval);
    }
  }, [connected, getRooms]);

  useEffect(() => {
    if (room && room.status === 'playing') {
      navigate('/game/online', { state: { room } });
    }
  }, [room, navigate]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      toast.error('Digite seu nome');
      return;
    }
    createRoom(playerName, maxPlayers, false);
    setShowCreateRoom(false);
  };

  const handleJoinRoom = (roomId: string) => {
    if (!playerName.trim()) {
      toast.error('Digite seu nome');
      return;
    }
    joinRoom(roomId, playerName);
  };

  const handleToggleReady = () => {
    if (room && currentPlayerId) {
      setPlayerReady(room.id, currentPlayerId);
    }
  };

  const handleStartGame = () => {
    if (room) {
      startGame(room.id);
    }
  };

  const handleAddBot = () => {
    if (room) {
      const botNumber = room.players.filter(p => p.name.startsWith('Bot')).length + 1;
      const botName = `Bot ${botNumber}`;
      joinRoom(room.id, botName);
      toast.success(`${botName} adicionado à sala`);
    }
  };

  useEffect(() => {
    if (room) {
      // Tenta encontrar o jogador pelo nome primeiro
      let player = room.players.find(p => p.name === playerName);
      
      // Se não encontrar pelo nome, pega o último jogador adicionado (que seria o jogador local)
      if (!player && room.players.length > 0) {
        player = room.players[room.players.length - 1];
      }
      
      if (player) {
        setCurrentPlayerId(player.id);
      }
    }
  }, [room, playerName]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-game-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-game-gold mx-auto mb-4"></div>
          <p className="text-game-light">Conectando ao servidor...</p>
        </div>
      </div>
    );
  }

  if (room) {
    return (
      <div className="min-h-screen bg-game-dark p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => window.location.reload()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair da Sala
          </Button>

          <Card className="bg-game-darker border-game-gold/20">
            <CardHeader>
              <CardTitle className="text-2xl text-game-gold">
                Sala: {room.id}
              </CardTitle>
              <CardDescription className="text-game-light/60">
                Aguardando jogadores ({room.players.length}/{room.maxPlayers})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {room.players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      player.isReady
                        ? 'bg-green-500/10 border-green-500/50'
                        : player.id === currentPlayerId
                        ? 'bg-blue-500/10 border-blue-500/50'
                        : 'bg-game-card border-game-gold/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-game-gold" />
                        <span className="text-game-light font-medium">
                          {player.name} {player.id === currentPlayerId && '(Você)'}
                        </span>
                      </div>
                      {player.isReady && (
                        <span className="text-green-400 text-sm">✓ Pronto</span>
                      )}
                    </div>
                  </motion.div>
                ))}

                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleToggleReady}
                    variant={room.players.find(p => p.id === currentPlayerId)?.isReady ? 'outline' : 'default'}
                    className="flex-1"
                  >
                    {room.players.find(p => p.id === currentPlayerId)?.isReady ? 'Cancelar' : 'Pronto'}
                  </Button>

                  {room.players.length < room.maxPlayers && (
                    <Button
                      onClick={handleAddBot}
                      variant="secondary"
                      className="flex-1"
                    >
                      <Bot className="w-4 h-4 mr-2" />
                      Adicionar Bot
                    </Button>
                  )}

                  {room.players.every(p => p.isReady) && room.players.length >= 2 && (
                    <Button
                      onClick={handleStartGame}
                      className="flex-1 bg-game-gold text-game-dark hover:bg-game-gold/90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Jogo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-dark p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-game-gold mb-2">Lobby Online</h1>
            <p className="text-game-light/60">Crie ou entre em uma sala para jogar</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {!showCreateRoom && (
          <Card className="bg-game-darker border-game-gold/20 mb-6">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Input
                  placeholder="Seu nome"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => setShowCreateRoom(true)}
                  disabled={!playerName.trim()}
                  className="bg-game-gold text-game-dark hover:bg-game-gold/90"
                >
                  Criar Sala
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showCreateRoom && (
          <Card className="bg-game-darker border-game-gold/20 mb-6">
            <CardHeader>
              <CardTitle className="text-game-gold">Criar Nova Sala</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxPlayers">Número máximo de jogadores</Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  min="2"
                  max="6"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleCreateRoom}
                  className="flex-1 bg-game-gold text-game-dark hover:bg-game-gold/90"
                >
                  Criar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateRoom(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-game-gold">Salas Disponíveis</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={getRooms}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {rooms.length === 0 ? (
          <Card className="bg-game-darker border-game-gold/20">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-game-gold/50 mx-auto mb-4" />
              <p className="text-game-light/60">Nenhuma sala disponível</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rooms.map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-game-darker border-game-gold/20 hover:border-game-gold/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-game-gold mb-2">
                          Sala {r.id}
                        </h3>
                        <p className="text-game-light/60 text-sm">
                          {r.players.length}/{r.maxPlayers} jogadores
                        </p>
                      </div>
                      <Button
                        onClick={() => handleJoinRoom(r.id)}
                        disabled={r.players.length >= r.maxPlayers || !playerName}
                        className="bg-game-gold text-game-dark hover:bg-game-gold/90"
                      >
                        Entrar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLobby;
