import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async getFriends(userId: string) {
    const friends = await this.prisma.prisma.friend.findMany({
      where: {
        OR: [
          { userId, status: 'accepted' },
          { friendId: userId, status: 'accepted' },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nick: true,
          },
        },
        friend: {
          select: {
            id: true,
            username: true,
            nick: true,
          },
        },
      },
    });

    return friends.map(f => {
      const isSender = f.userId === userId;
      const friend = isSender ? f.friend : f.user;
      return {
        id: f.id,
        friendId: friend.id,
        username: friend.username,
        nick: friend.nick,
        status: f.status,
      };
    });
  }

  async sendFriendRequest(userId: string, friendUsername: string) {
    const friend = await this.prisma.prisma.user.findUnique({
      where: { username: friendUsername },
    });

    if (!friend) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (friend.id === userId) {
      throw new BadRequestException('Você não pode adicionar a si mesmo');
    }

    const existing = await this.prisma.prisma.friend.findFirst({
      where: {
        OR: [
          { userId, friendId: friend.id },
          { userId: friend.id, friendId: userId },
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('Pedido de amizade já existe');
    }

    return this.prisma.prisma.friend.create({
      data: {
        userId,
        friendId: friend.id,
        status: 'pending',
      },
    });
  }

  async getPendingRequests(userId: string) {
    return this.prisma.prisma.friend.findMany({
      where: {
        friendId: userId,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nick: true,
          },
        },
      },
    });
  }

  async respondFriendRequest(userId: string, requestId: string, accept: boolean) {
    const request = await this.prisma.prisma.friend.findUnique({
      where: { id: requestId },
    });

    if (!request || request.friendId !== userId) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return this.prisma.prisma.friend.update({
      where: { id: requestId },
      data: {
        status: accept ? 'accepted' : 'rejected',
      },
    });
  }

  async removeFriend(userId: string, friendshipId: string) {
    const friendship = await this.prisma.prisma.friend.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship || (friendship.userId !== userId && friendship.friendId !== userId)) {
      throw new NotFoundException('Amizade não encontrada');
    }

    await this.prisma.prisma.friend.delete({
      where: { id: friendshipId },
    });

    return { message: 'Amizade removida com sucesso' };
  }
}
