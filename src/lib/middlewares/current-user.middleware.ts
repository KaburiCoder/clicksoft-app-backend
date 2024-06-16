import { JwtPayload } from '@/api/auth/interfaces/jwt-payload';
import { UsersService } from '@/users/users.service';
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { clearAccessToken, getAccessToken, setAccessTokenCookie } from '../utils/cookie-util';
import { User } from '../../db/mongo-schema/user.schema';
import { AuthService } from '@/api/auth/auth.service';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersSvc: UsersService,
    private authSvc: AuthService,
    private refreshTokenSvc: RefreshTokenService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = getAccessToken(req);
    if (!accessToken) return next();

    // AccessToken 인증
    let payload = await this.authSvc.verifyToken(accessToken);
    if (payload) {
      // AccessToken 인증 성공 시 currentUser 할당
      const user = await this.usersSvc.findOneById(payload?.sub);
      if (!user) {
        clearAccessToken(res);
        return next()
      };
      req.currentUser = user;
      return next();
    }
    clearAccessToken(res);

    // AccessToken 인증 실패 시 payload 가져오기
    payload = this.jwtService.decode(accessToken);
    if (!payload) return next();
    // payload의 아이디 정보와 AccessToken으로 RefreshToken 가져오기
    const refreshToken = await this.refreshTokenSvc.findRefreshToken(payload?.sub, accessToken);;
    if (!refreshToken) return next();

    // RefreshToken 인증
    payload = await this.authSvc.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (payload) {
      const user = await this.usersSvc.findOneById(payload.sub);
      if (!user) return next();
      // 기존 RefreshToken 데이터 삭제
      await this.refreshTokenSvc.deleteByAccessToken(accessToken);

      // 새로운 RefreshToken과 AccessToken 발급
      const newTokens = await this.authSvc.createJwtTokens({ email: user.email, sub: payload?.sub });
      setAccessTokenCookie(res, newTokens.accessToken);
      req.currentUser = user;
      return next();
    }

    next();
  }
}
