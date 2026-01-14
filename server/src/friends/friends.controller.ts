import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guards/auth.guards';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Get()
  async getFriends(@Request() req) {
    return this.friendsService.getFriends(req.user.userId);
  }

  @Get('pending')
  async getPendingRequests(@Request() req) {
    return this.friendsService.getPendingRequests(req.user.userId);
  }

  @Post('request')
  async sendFriendRequest(@Request() req, @Body() body: { friendUsername: string }) {
    return this.friendsService.sendFriendRequest(req.user.userId, body.friendUsername);
  }

  @Post('respond')
  async respondFriendRequest(@Request() req, @Body() body: { requestId: string; accept: boolean }) {
    return this.friendsService.respondFriendRequest(req.user.userId, body.requestId, body.accept);
  }

  @Delete(':friendshipId')
  async removeFriend(@Request() req, @Param('friendshipId') friendshipId: string) {
    return this.friendsService.removeFriend(req.user.userId, friendshipId);
  }
}
