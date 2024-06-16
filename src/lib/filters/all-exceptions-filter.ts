import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongooseError } from 'mongoose';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);
    const errors = this.getErrors(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errors,
    });
  }

  getStatus(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getStatus()
    } else if (exception instanceof MongooseError || exception instanceof ZodError) {
      return 400;
    }
    return 500;
  }

  getErrors(exception: unknown) {
    if (exception instanceof ZodError) {
      return exception.flatten().fieldErrors;
    }
  }

  getMessage(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception.getResponse();
    }
    
    if (exception && typeof exception === "object" && "message" in exception && typeof exception.message === 'string') {
      return exception.message
    }

    return 'Internal server error';
  }
}