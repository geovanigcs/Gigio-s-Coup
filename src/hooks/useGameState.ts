import { useState, useCallback } from 'react';
import { GameState, Player, ActionType, GamePhase, Card } from '@/types/game';
import { CharacterType, createDeck, shuffleDeck, CHARACTERS } from '@/assets/characters';

const createInitialPlayer = (id: string, name: string, cards: CharacterType[]): Player => ({
  id,
  name,
  coins: 2,
  cards: cards.map(character => ({ character, revealed: false })),
  isAlive: true,
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startGame = useCallback((playerNames: string[]) => {
    const deck = createDeck();
    const players: Player[] = [];
    let deckIndex = 0;

    playerNames.forEach((name, index) => {
      const playerCards = [deck[deckIndex], deck[deckIndex + 1]];
      deckIndex += 2;
      players.push(createInitialPlayer(`player-${index}`, name, playerCards));
    });

    const remainingDeck = deck.slice(deckIndex);

    setGameState({
      players,
      currentPlayerIndex: 0,
      deck: remainingDeck,
      phase: 'action',
      currentAction: null,
      pendingBlock: null,
      winner: null,
      log: [`🎮 Jogo iniciado com ${playerNames.length} jogadores!`],
    });
  }, []);

  const addLog = useCallback((message: string) => {
    setGameState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        log: [...prev.log, message],
      };
    });
  }, []);

  const getCurrentPlayer = useCallback((): Player | null => {
    if (!gameState) return null;
    return gameState.players[gameState.currentPlayerIndex];
  }, [gameState]);

  const nextTurn = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev;
      
      let nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      while (!prev.players[nextIndex].isAlive) {
        nextIndex = (nextIndex + 1) % prev.players.length;
      }

      const alivePlayers = prev.players.filter(p => p.isAlive);
      if (alivePlayers.length === 1) {
        return {
          ...prev,
          phase: 'game_over',
          winner: alivePlayers[0],
          log: [...prev.log, `🏆 ${alivePlayers[0].name} venceu o jogo!`],
        };
      }

      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        phase: 'action',
        currentAction: null,
        pendingBlock: null,
      };
    });
  }, []);

  const endTurn = useCallback(() => {
    nextTurn();
  }, [nextTurn]);

  const performAction = useCallback((action: ActionType, targetId?: string) => {
    setGameState(prev => {
      if (!prev) return prev;
      const currentPlayer = prev.players[prev.currentPlayerIndex];
      const newPlayers = [...prev.players];
      const playerIndex = prev.currentPlayerIndex;
      let newLog = [...prev.log];

      switch (action) {
        case 'income':
          newPlayers[playerIndex] = { ...currentPlayer, coins: currentPlayer.coins + 1 };
          newLog.push(`💰 ${currentPlayer.name} pegou 1 moeda (Renda)`);
          
          // Auto pass turn after income
          let nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
          while (!prev.players[nextIndex].isAlive) {
            nextIndex = (nextIndex + 1) % prev.players.length;
          }
          
          return { 
            ...prev, 
            players: newPlayers, 
            log: newLog,
            currentPlayerIndex: nextIndex,
            phase: 'action',
          };

        case 'foreign_aid':
          newLog.push(`💰💰 ${currentPlayer.name} tentou pegar 2 moedas (Ajuda Externa)`);
          return {
            ...prev,
            log: newLog,
            phase: 'block',
            currentAction: {
              type: action,
              playerId: currentPlayer.id,
              canBeBlocked: true,
              canBeChallenged: false,
            },
          };

        case 'coup':
          if (currentPlayer.coins < 7) return prev;
          newPlayers[playerIndex] = { ...currentPlayer, coins: currentPlayer.coins - 7 };
          newLog.push(`⚔️ ${currentPlayer.name} deu um Golpe de Estado em ${prev.players.find(p => p.id === targetId)?.name}!`);
          return {
            ...prev,
            players: newPlayers,
            log: newLog,
            phase: 'lose_influence',
            currentAction: {
              type: action,
              playerId: currentPlayer.id,
              targetId,
              canBeBlocked: false,
              canBeChallenged: false,
            },
          };

        case 'tax':
          newLog.push(`👑 ${currentPlayer.name} alega ser o Duque e tenta taxar 3 moedas`);
          return {
            ...prev,
            log: newLog,
            phase: 'challenge',
            currentAction: {
              type: action,
              playerId: currentPlayer.id,
              canBeBlocked: false,
              canBeChallenged: true,
              requiredCharacter: 'duke',
            },
          };

        case 'assassinate':
          if (currentPlayer.coins < 3) return prev;
          newPlayers[playerIndex] = { ...currentPlayer, coins: currentPlayer.coins - 3 };
          newLog.push(`🗡️ ${currentPlayer.name} paga 3 moedas e tenta assassinar ${prev.players.find(p => p.id === targetId)?.name}`);
          return {
            ...prev,
            players: newPlayers,
            log: newLog,
            phase: 'challenge',
            currentAction: {
              type: action,
              playerId: currentPlayer.id,
              targetId,
              canBeBlocked: true,
              canBeChallenged: true,
              requiredCharacter: 'assassin',
            },
          };

        case 'steal':
          newLog.push(`⚓ ${currentPlayer.name} tenta roubar 2 moedas de ${prev.players.find(p => p.id === targetId)?.name}`);
          return {
            ...prev,
            log: newLog,
            phase: 'challenge',
            currentAction: {
              type: action,
              playerId: currentPlayer.id,
              targetId,
              canBeBlocked: true,
              canBeChallenged: true,
              requiredCharacter: 'captain',
            },
          };

        case 'exchange':
          newLog.push(`🎭 ${currentPlayer.name} alega ser o Embaixador e tenta trocar cartas`);
          return {
            ...prev,
            log: newLog,
            phase: 'challenge',
            currentAction: {
              type: action,
              playerId: currentPlayer.id,
              canBeBlocked: false,
              canBeChallenged: true,
              requiredCharacter: 'ambassador',
            },
          };
      }

      return prev;
    });
  }, []);

  const resolveAction = useCallback(() => {
    setGameState(prev => {
      if (!prev || !prev.currentAction) return prev;
      
      const action = prev.currentAction;
      const newPlayers = [...prev.players];
      const playerIndex = newPlayers.findIndex(p => p.id === action.playerId);
      const player = newPlayers[playerIndex];
      let newLog = [...prev.log];

      switch (action.type) {
        case 'foreign_aid':
          newPlayers[playerIndex] = { ...player, coins: player.coins + 2 };
          newLog.push(`✅ ${player.name} recebeu 2 moedas`);
          break;

        case 'tax':
          newPlayers[playerIndex] = { ...player, coins: player.coins + 3 };
          newLog.push(`✅ ${player.name} recebeu 3 moedas (Taxar)`);
          break;

        case 'steal':
          const targetIndex = newPlayers.findIndex(p => p.id === action.targetId);
          const target = newPlayers[targetIndex];
          const stolenAmount = Math.min(2, target.coins);
          newPlayers[targetIndex] = { ...target, coins: target.coins - stolenAmount };
          newPlayers[playerIndex] = { ...player, coins: player.coins + stolenAmount };
          newLog.push(`✅ ${player.name} roubou ${stolenAmount} moedas de ${target.name}`);
          break;

        case 'exchange':
          newLog.push(`✅ ${player.name} trocou cartas com o deck`);
          break;

        case 'assassinate':
          newLog.push(`✅ O assassinato foi bem-sucedido!`);
          return {
            ...prev,
            players: newPlayers,
            log: newLog,
            phase: 'lose_influence',
          };
      }

      // Auto pass turn after action resolution
      let nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      while (!prev.players[nextIndex].isAlive) {
        nextIndex = (nextIndex + 1) % prev.players.length;
      }

      return {
        ...prev,
        players: newPlayers,
        log: newLog,
        currentPlayerIndex: nextIndex,
        phase: 'action',
        currentAction: null,
        pendingBlock: null,
      };
    });
  }, []);

  const loseInfluence = useCallback((playerId: string, cardIndex: number) => {
    setGameState(prev => {
      if (!prev) return prev;

      const newPlayers = [...prev.players];
      const playerIndex = newPlayers.findIndex(p => p.id === playerId);
      const player = newPlayers[playerIndex];
      
      const newCards = [...player.cards];
      newCards[cardIndex] = { ...newCards[cardIndex], revealed: true };
      
      const isAlive = newCards.some(c => !c.revealed);
      newPlayers[playerIndex] = { ...player, cards: newCards, isAlive };

      const newLog = [...prev.log, `❌ ${player.name} perdeu ${CHARACTERS[newCards[cardIndex].character].namePortuguese}`];

      const alivePlayers = newPlayers.filter(p => p.isAlive);
      if (alivePlayers.length === 1) {
        return {
          ...prev,
          players: newPlayers,
          phase: 'game_over',
          winner: alivePlayers[0],
          log: [...newLog, `🏆 ${alivePlayers[0].name} venceu o jogo!`],
        };
      }

      // Auto pass turn after losing influence
      let nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      while (!newPlayers[nextIndex].isAlive) {
        nextIndex = (nextIndex + 1) % newPlayers.length;
      }

      return {
        ...prev,
        players: newPlayers,
        log: newLog,
        currentPlayerIndex: nextIndex,
        phase: 'action',
        currentAction: null,
      };
    });
  }, []);

  const challenge = useCallback((challengerId: string) => {
    setGameState(prev => {
      if (!prev || !prev.currentAction) return prev;

      const action = prev.currentAction;
      const actorIndex = prev.players.findIndex(p => p.id === action.playerId);
      const actor = prev.players[actorIndex];
      const challenger = prev.players.find(p => p.id === challengerId);
      
      if (!challenger || !action.requiredCharacter) return prev;

      const hasCharacter = actor.cards.some(
        c => c.character === action.requiredCharacter && !c.revealed
      );

      const newLog = [...prev.log, `🔍 ${challenger.name} contestou ${actor.name}!`];

      if (hasCharacter) {
        newLog.push(`😬 ${actor.name} realmente tinha ${CHARACTERS[action.requiredCharacter].namePortuguese}!`);
        return {
          ...prev,
          log: newLog,
          phase: 'lose_influence',
          currentAction: {
            ...action,
            targetId: challengerId,
          },
        };
      } else {
        newLog.push(`🎭 ${actor.name} estava blefando!`);
        return {
          ...prev,
          log: newLog,
          phase: 'lose_influence',
          currentAction: {
            ...action,
            targetId: action.playerId,
            playerId: challengerId,
          },
        };
      }
    });
  }, []);

  const skipChallenge = useCallback(() => {
    setGameState(prev => {
      if (!prev || !prev.currentAction) return prev;

      const action = prev.currentAction;

      if (action.canBeBlocked) {
        return {
          ...prev,
          phase: 'block',
          log: [...prev.log, '⏭️ Ninguém contestou. Aguardando bloqueios...'],
        };
      }

      return prev;
    });

    setTimeout(() => resolveAction(), 300);
  }, [resolveAction]);

  const blockAction = useCallback((blockerId: string, character: CharacterType) => {
    setGameState(prev => {
      if (!prev) return prev;

      const blocker = prev.players.find(p => p.id === blockerId);
      if (!blocker) return prev;

      const newLog = [...prev.log, `🛡️ ${blocker.name} alega ter ${CHARACTERS[character].namePortuguese} e bloqueia!`];

      return {
        ...prev,
        log: newLog,
        phase: 'block_challenge',
        pendingBlock: {
          blockerId,
          blockType: `${character}_block` as any,
          character,
        },
      };
    });
  }, []);

  const acceptBlock = useCallback(() => {
    setGameState(prev => {
      if (!prev) return prev;
      
      // Auto pass turn after accepting block
      let nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      while (!prev.players[nextIndex].isAlive) {
        nextIndex = (nextIndex + 1) % prev.players.length;
      }
      
      return {
        ...prev,
        log: [...prev.log, '✅ Bloqueio aceito!'],
        currentPlayerIndex: nextIndex,
        phase: 'action',
        currentAction: null,
        pendingBlock: null,
      };
    });
  }, []);

  const skipBlock = useCallback(() => {
    resolveAction();
  }, [resolveAction]);

  const resetGame = useCallback(() => {
    setGameState(null);
  }, []);

  return {
    gameState,
    startGame,
    getCurrentPlayer,
    performAction,
    resolveAction,
    loseInfluence,
    challenge,
    skipChallenge,
    blockAction,
    acceptBlock,
    skipBlock,
    nextTurn,
    endTurn,
    resetGame,
  };
};
