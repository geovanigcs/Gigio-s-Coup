import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/guards/auth.guards';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('history')
  async getHistory(@Request() req) {
    return this.gameService.getHistory(req.user.userId);
  }

  @Post('result')
  async saveResult(@Request() req, @Body() body: { result: string; mode: string; players: number; duration?: number }) {
    return this.gameService.saveResult(
      req.user.userId,
      body.result,
      body.mode,
      body.players,
      body.duration,
    );
  }
}
