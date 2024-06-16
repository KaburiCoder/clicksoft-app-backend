import { NestMiddleware } from "@nestjs/common";
import * as cookieParser from 'cookie-parser'
export class CookieParserMiddleware implements NestMiddleware{
  use(req: any, res: any, next: (error?: any) => void) {
    cookieParser
  }

}