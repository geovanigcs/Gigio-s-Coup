import { Injectable, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../common/email.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(EmailService) private readonly emailService: EmailService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    
    return {
      message: 'Login realizado com sucesso',
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        nick: user.nick,
        email: user.email,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOne(registerDto.username);
    if (existingUser) {
      throw new ConflictException('Nome de usuário já existe');
    }

    const existingEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = await this.usersService.create(
      registerDto.username,
      registerDto.nick,
      registerDto.email,
      registerDto.password,
    );

    const payload = { username: user.username, sub: user.id };
    
    return {
      message: 'Usuário criado com sucesso',
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return {
        message: 'Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.',
      };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'password-reset' },
      { expiresIn: '1h' }
    );

    const resetUrl = `${process.env.APP_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`;

    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetUrl, user.username);
      
      return {
        message: 'Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.',
      };
    } catch (error) {
      return {
        message: 'Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.',
      };
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token);
      
      if (decoded.type !== 'password-reset') {
        throw new UnauthorizedException('Token inválido');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await this.usersService.updatePassword(decoded.sub, hashedPassword);

      return {
        message: 'Senha redefinida com sucesso',
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
