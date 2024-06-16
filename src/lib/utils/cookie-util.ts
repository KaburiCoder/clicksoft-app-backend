import { CookieOptions, Request, Response } from 'express';
const JWT = "jwt-acc";

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const options: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
  };

  res.cookie(JWT, accessToken, options);
};

export const getAccessToken = (req: Request) => {
  return req.cookies?.[JWT];
}

export const clearAccessToken = (res: Response) => {
  res.clearCookie(JWT);
}