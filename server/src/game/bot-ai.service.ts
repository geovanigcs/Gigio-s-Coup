import { Injectable } from '@nestjs/common';
import { GameRoom, Player, GameAction, Character } from './dto/game-events.dto';

interface ActionDecision {
  action: GameAction;
  targetId?: string;
  claimedCharacter?: Character;
}

@Injectable()
export class BotAIService {
  /**
   * Decide a próxima ação do bot baseado no estado do jogo
   */
  decideAction(room: GameRoom, botPlayer: Player): ActionDecision {
    const alivePlayers = room.players.filter(p => p.isAlive && p.id !== botPlayer.id);
    const botCoins = botPlayer.coins;

    // REGRA OBRIGATÓRIA: Se tem 10+ moedas, DEVE dar coup
    if (botCoins >= 10) {
      return this.decideCoup(alivePlayers);
    }

    // ESTRATÉGIA AGRESSIVA: Se tem 7+ moedas, considera coup ou assassinate
    if (botCoins >= 7) {
      const shouldCoup = Math.random() > 0.3; // 70% chance de coup
      if (shouldCoup) {
        return this.decideCoup(alivePlayers);
      }
      // 30% chance de assassinate se tiver moedas suficientes
      if (botCoins >= 3) {
        return this.decideAssassinate(alivePlayers);
      }
    }

    // ESTRATÉGIA: Se tem 3-6 moedas, várias opções
    if (botCoins >= 3) {
      const strategies = [
        { action: 'assassinate', weight: 0.3 },
        { action: 'tax', weight: 0.25 },
        { action: 'steal', weight: 0.25 },
        { action: 'exchange', weight: 0.2 },
      ];

      const choice = this.weightedRandom(strategies);

      switch (choice) {
        case 'assassinate':
          return this.decideAssassinate(alivePlayers);
        case 'tax':
          return { action: 'tax', claimedCharacter: 'duke' };
        case 'steal':
          return this.decideSteal(alivePlayers);
        case 'exchange':
          return { action: 'exchange', claimedCharacter: 'ambassador' };
      }
    }

    // ESTRATÉGIA: 0-2 moedas - foco em acumular recursos
    const lowCoinStrategies = [
      { action: 'foreign_aid', weight: 0.4 },
      { action: 'tax', weight: 0.3 },
      { action: 'steal', weight: 0.2 },
      { action: 'income', weight: 0.1 },
    ];

    const choice = this.weightedRandom(lowCoinStrategies);

    switch (choice) {
      case 'foreign_aid':
        return { action: 'foreign_aid' };
      case 'tax':
        return { action: 'tax', claimedCharacter: 'duke' };
      case 'steal':
        return this.decideSteal(alivePlayers);
      default:
        return { action: 'income' };
    }
  }

  /**
   * Decide se deve desafiar uma ação
   */
  shouldChallenge(
    room: GameRoom,
    botPlayer: Player,
    action: GameAction,
    claimedCharacter?: Character,
  ): boolean {
    if (!claimedCharacter) return false;

    const actingPlayer = room.players.find(p => p.id === room.currentPlayer);
    if (!actingPlayer) return false;

    // Não desafiar se o jogador tem apenas 1 carta (muito arriscado)
    const botAliveCards = botPlayer.cards.filter(c => !c.revealed).length;
    if (botAliveCards <= 1) {
      return Math.random() < 0.1; // Apenas 10% de chance
    }

    // Estratégia baseada na ação
    switch (action) {
      case 'assassinate':
        // Se está sendo alvo, maior chance de desafiar
        if (room.pendingAction?.targetId === botPlayer.id) {
          return Math.random() < 0.4; // 40% chance
        }
        return Math.random() < 0.2; // 20% chance normal
      
      case 'steal':
        // Se está sendo roubado, desafiar com frequência moderada
        if (room.pendingAction?.targetId === botPlayer.id) {
          return Math.random() < 0.35; // 35% chance
        }
        return Math.random() < 0.15;
      
      case 'tax':
        // Duke é comum, baixa chance de desafiar
        return Math.random() < 0.15;
      
      case 'exchange':
        // Ambassador é estratégico, chance moderada
        return Math.random() < 0.2;
      
      default:
        return Math.random() < 0.1;
    }
  }

  /**
   * Decide se deve bloquear uma ação
   */
  shouldBlock(
    room: GameRoom,
    botPlayer: Player,
    action: GameAction,
  ): { block: boolean; claimedCharacter?: Character } {
    const botAliveCards = botPlayer.cards.filter(c => !c.revealed).length;
    
    // Se tem apenas 1 carta, ser mais cauteloso
    const riskFactor = botAliveCards <= 1 ? 0.5 : 1.0;

    switch (action) {
      case 'foreign_aid':
        // Duke pode bloquear - chance moderada
        if (Math.random() < 0.3 * riskFactor) {
          return { block: true, claimedCharacter: 'duke' };
        }
        break;
      
      case 'steal':
        // Verificar se é o alvo
        if (room.pendingAction?.targetId === botPlayer.id) {
          // Ambassador ou Captain podem bloquear
          const blockChance = 0.5 * riskFactor;
          if (Math.random() < blockChance) {
            const blockChar = Math.random() < 0.5 ? 'ambassador' : 'captain';
            return { block: true, claimedCharacter: blockChar };
          }
        }
        break;
      
      case 'assassinate':
        // Contessa bloqueia assassinato - alta prioridade se for alvo
        if (room.pendingAction?.targetId === botPlayer.id) {
          const blockChance = 0.7 * riskFactor; // 70% de tentar bloquear
          if (Math.random() < blockChance) {
            return { block: true, claimedCharacter: 'contessa' };
          }
        }
        break;
    }

    return { block: false };
  }

  /**
   * Decide qual carta revelar quando perde influência
   */
  chooseCardToReveal(botPlayer: Player): string {
    const aliveCards = botPlayer.cards.filter(c => !c.revealed);
    
    if (aliveCards.length === 0) return '';
    if (aliveCards.length === 1) return aliveCards[0].character;

    // Prioridade de cartas a manter (menos valiosa revelada primeiro)
    const cardValue: Record<Character, number> = {
      duke: 5,        // Muito valioso (tax + block foreign aid)
      assassin: 4,    // Valioso (assassinate)
      contessa: 4,    // Valioso (block assassinate)
      captain: 3,     // Útil (steal)
      ambassador: 3,  // Útil (exchange + block steal)
    };

    // Ordena cartas por valor (menor valor = revelar primeiro)
    const sortedCards = aliveCards.sort((a, b) => 
      cardValue[a.character] - cardValue[b.character]
    );

    return sortedCards[0].character;
  }

  /**
   * Decide qual cartas descartar na troca (exchange)
   */
  chooseCardsToDiscard(availableCards: Character[], keepCount: number): Character[] {
    // Prioridade de cartas a manter
    const cardPriority: Record<Character, number> = {
      duke: 5,
      assassin: 4,
      contessa: 4,
      captain: 3,
      ambassador: 3,
    };

    // Ordena cartas por prioridade (maior = melhor)
    const sorted = availableCards.sort((a, b) => 
      cardPriority[b] - cardPriority[a]
    );

    // Mantém as melhores, retorna as que devem ser descartadas
    const toKeep = sorted.slice(0, keepCount);
    return availableCards.filter(c => !toKeep.includes(c));
  }

  // ===== MÉTODOS AUXILIARES =====

  private decideCoup(alivePlayers: Player[]): ActionDecision {
    // Prioriza jogador com mais cartas
    const target = this.selectTarget(alivePlayers, 'most-cards');
    return {
      action: 'coup',
      targetId: target.id,
    };
  }

  private decideAssassinate(alivePlayers: Player[]): ActionDecision {
    // Prioriza jogador com mais cartas (ameaça maior)
    const target = this.selectTarget(alivePlayers, 'most-cards');
    return {
      action: 'assassinate',
      targetId: target.id,
      claimedCharacter: 'assassin',
    };
  }

  private decideSteal(alivePlayers: Player[]): ActionDecision {
    // Prioriza jogador com mais moedas
    const target = this.selectTarget(alivePlayers, 'most-coins');
    return {
      action: 'steal',
      targetId: target.id,
      claimedCharacter: 'captain',
    };
  }

  private selectTarget(
    players: Player[],
    strategy: 'most-cards' | 'most-coins' | 'random',
  ): Player {
    if (players.length === 0) {
      throw new Error('No players available for targeting');
    }

    switch (strategy) {
      case 'most-cards':
        return players.reduce((prev, curr) => {
          const prevCards = prev.cards.filter(c => !c.revealed).length;
          const currCards = curr.cards.filter(c => !c.revealed).length;
          return currCards > prevCards ? curr : prev;
        });
      
      case 'most-coins':
        return players.reduce((prev, curr) => 
          curr.coins > prev.coins ? curr : prev
        );
      
      case 'random':
      default:
        return players[Math.floor(Math.random() * players.length)];
    }
  }

  private weightedRandom(options: Array<{ action: string; weight: number }>): string {
    const total = options.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * total;

    for (const option of options) {
      random -= option.weight;
      if (random <= 0) {
        return option.action;
      }
    }

    return options[0].action;
  }
}
