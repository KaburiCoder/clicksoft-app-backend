import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto as SignupDto, SignupResponse, signupSchema } from './dto/sign-up.dto';
import { SigninDto } from './dto/sign-in.dto';
import { ZodValidate } from '@/lib/pipes/zod-validation.pipe';
import { Request, Response } from 'express';
import { clearAccessToken, getAccessToken, setAccessTokenCookie } from '@/lib/utils/cookie-util';
import { CurrentUser } from '@/lib/decorators/current-user';
import { User } from '@/db/mongo-schema/user.schema';
import { AuthGuards } from '@/lib/guards/auth-guards';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { RolesGuard } from '@/lib/guards/roles.guard';
import { Roles } from '@/lib/decorators/roles.decorator';
import { AuthGuard } from '@/lib/guards/auth.guard';

@Controller('/api2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private refreshTokenSvc: RefreshTokenService) { }

  @HttpCode(201)
  @ZodValidate(signupSchema, SignupResponse)
  @Post("/signup")
  create(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post("/signin")
  async signin(@Body() dto: SigninDto, @Res() res: Response) {
    const { accessToken } = await this.authService.signin(dto);
    setAccessTokenCookie(res, accessToken);

    res.status(200).send(true)
  }

  @Get('/signout')
  async signout(@Req() req: Request, @Res() res: Response) {
    const accessToken = getAccessToken(req);
    if (accessToken) {
      clearAccessToken(res);
      await this.refreshTokenSvc.deleteByAccessToken(accessToken);
    }

    res.status(200).send(true);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post("/currentuser")
  async currentUser(@CurrentUser() user: User) {
    const { password, ...newUser } = user || {};
    return newUser;
  }



  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
