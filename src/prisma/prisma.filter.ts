import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from "../generated/prisma/client"

import { Response, Request } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';

    switch (exception.code) {
      case 'P2002': {
        // Unique constraint (e.g., duplicate email)
        const field = (exception.meta?.target as string[])?.join(', ');
        message = field
          ? `${field} already exists`
          : 'Unique constraint failed';
        status = HttpStatus.CONFLICT;
        break;
      }

      case 'P2025':
        // Record not found
        message = 'Record not found';
        status = HttpStatus.NOT_FOUND;
        break;

      case 'P2003':
        // Foreign key constraint
        message = 'Invalid reference to related record';
        status = HttpStatus.BAD_REQUEST;
        break;

      default:
        // Avoid exposing internal DB errors
        message = 'Database error occurred';
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
