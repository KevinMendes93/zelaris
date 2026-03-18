import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { FakeMailerService } from './fake-mailer.service';
import { plainToInstance } from 'class-transformer';
import {
  JwtPayload,
  ResetTokenPayload,
  Tokens,
} from '../../auth/interfaces/jwt.interface';
import type { Response, Request } from 'express';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly fakeMailerService: FakeMailerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existsUserByCpf = await this.userService.findByCpf(registerDto.cpf);
    if (existsUserByCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    const existsUserByEmail = await this.userService.findByEmail(
      registerDto.email,
    );
    if (existsUserByEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = await this.userService.create(
      plainToInstance(User, registerDto),
    );

    return user;
  }

  async validateUser(login: LoginDto): Promise<User | null> {
    const user = await this.userService.findByCpf(login.cpf);
    if (!user) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    const isPasswordValid = await bcrypt.compare(login.senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    return user;
  }

  async login(login: LoginDto, res: Response): Promise<Tokens> {
    const user = await this.validateUser(login);
    const tokens = await this.generateTokens(user!);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(refreshToken: string, res: Response): Promise<Tokens> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const tokens = this.generateTokens(user);
      this.setAuthCookies(
        res,
        (await tokens).accessToken,
        (await tokens).refreshToken,
      );
      return tokens;
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Por segurança, não informar que o email não existe
      return;
    }

    const resetToken = this.generateResetToken(user.id);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    this.fakeMailerService.sendPasswordRecoveryEmail(email, resetLink);
  }

  async resetPassword(token: string, novaSenha: string): Promise<void> {
    try {
      const payload = this.verifyResetToken(token);

      if (payload.typ !== 'password_reset') {
        throw new UnauthorizedException('Token inválido');
      }

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.userService.updatePassword(user.id, novaSenha);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  clearAuthCookies(res: Response): void {
    const domain =
      this.configService.get<string>('AUTH_COOKIE_DOMAIN') || undefined;

    res.clearCookie('access_token', { path: '/', domain });
    res.clearCookie('refresh_token', { path: '/', domain });
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const secure =
      this.configService.get<string>('AUTH_COOKIE_SECURE') === 'true';
    const sameSite =
      this.configService.get<string>('AUTH_COOKIE_SAMESITE') || 'lax';
    const domain =
      this.configService.get<string>('AUTH_COOKIE_DOMAIN') || undefined;

    const cookieOptions = {
      httpOnly: true,
      secure,
      sameSite: sameSite as 'lax' | 'strict' | 'none',
      domain,
      path: '/',
    };

    res.cookie('access_token', accessToken, {
      ...cookieOptions,
      maxAge:
        Number(this.configService.get<string>('JWT_ACCESS_EXP_MINUTES')) *
        60 *
        1000,
    });

    res.cookie('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge:
        Number(this.configService.get<string>('JWT_REFRESH_EXP_DAYS')) *
        24 *
        60 *
        60 *
        1000,
    });
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: JwtPayload = {
      sub: user.id,
      cpf: user.cpf,
      roles: user.roles,
    };

    const accessExpMinutes = this.configService.get<number>(
      'JWT_ACCESS_EXP_MINUTES',
      15,
    );
    const refreshExpDays = this.configService.get<number>(
      'JWT_REFRESH_EXP_DAYS',
      7,
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessExpMinutes * 60,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpDays * 24 * 60 * 60,
    });

    return { accessToken, refreshToken };
  }

  private generateResetToken(userId: number): string {
    const expMinutes = this.configService.get<number>(
      'RESET_TOKEN_EXP_MINUTES',
      30,
    );
    const payload: ResetTokenPayload = {
      sub: userId,
      typ: 'password_reset',
      exp: Math.floor(Date.now() / 1000) + expMinutes * 60,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('RESET_TOKEN_SECRET'),
    });
  }

  private verifyResetToken(token: string): ResetTokenPayload {
    return this.jwtService.verify<ResetTokenPayload>(token, {
      secret: this.configService.get<string>('RESET_TOKEN_SECRET'),
    });
  }
}
