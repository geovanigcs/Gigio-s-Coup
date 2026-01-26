import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Player {
  id: string;
  name: string;
  socketId: string;
  isReady: boolean;
  coins: number;
  cards: Array<{ character: string; revealed: boolean }>;
  isAlive: boolean;
}

export type GamePhase = 
  | 'setup' 
  | 'action' 
  | 'challenge' 
  | 'block' 
  | 'block_challenge' 
  | 'lose_influence' 
  | 'exchange' 
  | 'game_over';

interface GameRoom {
  id: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
  status: 'waiting' | 'playing' | 'finished';
  currentTurn: number;
  phase: GamePhase;
  deck: string[];
  pendingAction?: {
    type: string;
    playerId: string;
    targetId?: string;
    canBeBlocked: boolean;
    canBeChallenged: boolean;
  };
  pendingBlock?: {
    blockerId: string;
    blockType: string;
    character: string;
  } | null;
  winner?: Player | null;
  log: string[];
  lastAction?: string;
  createdAt: Date;
}

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

export const useGameSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [rooms, setRooms] = useState<GameRoom[]>([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      console.log('Connected to game server');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from game server');
      setConnected(false);
    });

    // Eventos de sala
    newSocket.on('roomCreated', (data: GameRoom) => {
      setRoom(data);
    });

    newSocket.on('playerJoined', (data: GameRoom) => {
      setRoom(data);
    });

    newSocket.on('playerLeft', (data: GameRoom) => {
      setRoom(data);
    });

    newSocket.on('playerReadyUpdate', (data: GameRoom) => {
      setRoom(data);
    });

    newSocket.on('gameStarted', (data: GameRoom) => {
      setRoom(data);
    });

    newSocket.on('roomsList', (data: GameRoom[]) => {
      setRooms(data);
    });

    // Eventos de jogo
    newSocket.on('actionPerformed', ({ room: updatedRoom }: { room: GameRoom }) => {
      setRoom(updatedRoom);
    });

    newSocket.on('actionChallenged', ({ room: updatedRoom }: { room: GameRoom }) => {
      setRoom(updatedRoom);
    });

    newSocket.on('actionBlocked', ({ room: updatedRoom }: { room: GameRoom }) => {
      setRoom(updatedRoom);
    });

    newSocket.on('influenceLost', ({ room: updatedRoom }: { room: GameRoom }) => {
      setRoom(updatedRoom);
    });

    newSocket.on('actionPassed', ({ room: updatedRoom }: { room: GameRoom }) => {
      setRoom(updatedRoom);
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = useCallback((playerName: string, maxPlayers: number, isPrivate: boolean) => {
    socket?.emit('createRoom', { playerName, maxPlayers, isPrivate });
  }, [socket]);

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    socket?.emit('joinRoom', { roomId, playerName });
  }, [socket]);

  const getRooms = useCallback(() => {
    socket?.emit('getRooms');
  }, [socket]);

  const setPlayerReady = useCallback((roomId: string, playerId: string) => {
    socket?.emit('playerReady', { roomId, playerId });
  }, [socket]);

  const startGame = useCallback((roomId: string) => {
    socket?.emit('startGame', { roomId });
  }, [socket]);

  const performAction = useCallback((
    roomId: string,
    playerId: string,
    action: string,
    targetId?: string,
    characterClaim?: string
  ) => {
    socket?.emit('gameAction', { roomId, playerId, action, targetId, characterClaim });
  }, [socket]);

  const challengeAction = useCallback((roomId: string, playerId: string, challengedPlayerId: string) => {
    socket?.emit('challengeAction', { roomId, playerId, challengedPlayerId });
  }, [socket]);

  const blockAction = useCallback((roomId: string, playerId: string, blockWith: string) => {
    socket?.emit('blockAction', { roomId, playerId, blockWith });
  }, [socket]);

  const loseInfluence = useCallback((roomId: string, playerId: string, cardIndex: number) => {
    socket?.emit('loseInfluence', { roomId, playerId, cardIndex });
  }, [socket]);

  const passAction = useCallback((roomId: string) => {
    socket?.emit('passAction', { roomId });
  }, [socket]);

  return {
    socket,
    connected,
    room,
    rooms,
    createRoom,
    joinRoom,
    getRooms,
    setPlayerReady,
    startGame,
    performAction,
    challengeAction,
    blockAction,
    loseInfluence,
    passAction,
  };
};
