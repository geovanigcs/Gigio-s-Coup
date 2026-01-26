import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameRoomService } from './game-room.service';
import { BotAIService } from './bot-ai.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [GameController],
  providers: [GameService, GameGateway, GameRoomService, BotAIService, PrismaService],
})
export class GameModule {}
