import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from 'express'

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  return request.currentUser;
})