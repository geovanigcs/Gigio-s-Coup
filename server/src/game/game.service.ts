import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getHistory(userId: string) {
    const history = await this.prisma.prisma.gameHistory.findMany({
      where: { playerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    const wins = history.filter(g => g.result === 'win').length;
    const losses = history.filter(g => g.result === 'loss').length;

    return {
      games: history,
      stats: {
        wins,
        losses,
        total: history.length,
        winRate: history.length > 0 ? (wins / history.length) * 100 : 0,
      },
    };
  }

  async saveResult(userId: string, result: string, mode: string, players: number, duration?: number) {
    return this.prisma.prisma.gameHistory.create({
      data: {
        playerId: userId,
        result,
        mode,
        players,
        duration,
      },
    });
  }
}
