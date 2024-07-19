import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { UsersService } from "@/users/users.service";
import { AuthService } from "@/api/auth/auth.service";
import { RefreshTokenService } from "@/refresh-token/refresh-token.service";
import { clearAccessToken, getAccessToken, setAccessTokenCookie } from "../utils/cookie-util";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersSvc: UsersService,
    private authSvc: AuthService,
    private refreshTokenSvc: RefreshTokenService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const res = context.switchToHttp().getResponse() as Response;

    const accessToken = getAccessToken(req);
    if (!accessToken) return false;

    // AccessToken 인증
    let payload = await this.authSvc.verifyToken(accessToken);
    if (payload) {
      // AccessToken 인증 성공 시 currentUser 할당
      const user = await this.usersSvc.findOneById(payload?.sub);
      if (!user) {
        clearAccessToken(res);
        return false;
      };
      req.currentUser = user;
      return true;
    }
    clearAccessToken(res);

    // AccessToken 인증 실패 시 payload 가져오기
    payload = this.jwtService.decode(accessToken);
    if (!payload) return false;
    // payload의 아이디 정보와 AccessToken으로 RefreshToken 가져오기
    const refreshToken = await this.refreshTokenSvc.findRefreshToken(payload?.sub, accessToken);;
    if (!refreshToken) return false;

    // RefreshToken 인증
    payload = await this.authSvc.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (payload) {
      const user = await this.usersSvc.findOneById(payload.sub);
      if (!user) return false;
      // 기존 RefreshToken 데이터 삭제
      await this.refreshTokenSvc.deleteByAccessToken(accessToken);

      // 새로운 RefreshToken과 AccessToken 발급
      const newTokens = await this.authSvc.createJwtTokens({ email: user.email, sub: payload?.sub });
      setAccessTokenCookie(res, newTokens.accessToken);
      req.currentUser = user;
      return true;
    }
    return false;
  }
}