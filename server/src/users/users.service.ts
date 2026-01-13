import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(username: string, nick: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return this.prisma.prisma.user.create({
      data: {
        username,
        nick,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        nick: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async findOne(username: string) {
    return this.prisma.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string) {
    return this.prisma.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nick: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.prisma.user.findUnique({
      where: { email },
    });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return this.prisma.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
