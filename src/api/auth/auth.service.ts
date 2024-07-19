import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/sign-up.dto';
import { SigninDto } from './dto/sign-in.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload';
import { UsersService } from '@/users/users.service';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersSvc: UsersService,
    private jwtSvc: JwtService,
    private refreshTokenSvc: RefreshTokenService) { }

  async signup({ email, password }: SignupDto) {
    const user = await this.usersSvc.findOneByEmail(email);

    if (user) {
      throw new ConflictException("이미 존재하는 계정입니다.")
    }

    const newUser = this.usersSvc.create(email, password);

    return newUser;
  }

  async signin({ email, password }: SigninDto) {
    const user = await this.usersSvc.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException("잘못된 이메일 또는 비밀번호입니다.")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("잘못된 이메일 또는 비밀번호입니다.");
    }

    const payload: JwtPayload = { email: user.email, sub: user.id };
    const tokens = await this.createJwtTokens(payload);

    return tokens;
  }

  async verifyToken(token: string, secret: string = process.env.JWT_KEY!): Promise<JwtPayload | undefined> {
    try {
      return await this.jwtSvc.verifyAsync(token, { secret }) as JwtPayload;
    } catch (error) {
      if (!(error instanceof TokenExpiredError)) {
        console.error('Token verification failed:', error);
      }
      return undefined;
    }
  }

  async createJwtTokens(payload: JwtPayload) {
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);
    await this.refreshTokenSvc.create(payload.sub, accessToken, refreshToken);
    return { accessToken, refreshToken };
  }

  private async createAccessToken(payload: JwtPayload) {
    return await this.jwtSvc.signAsync(payload);
  }

  private async createRefreshToken(payload: JwtPayload) {
    const refreshToken = await this.jwtSvc.signAsync(payload, { secret: process.env.JWT_RF_KEY, expiresIn: "2d" });
    return refreshToken;
  }
}

