import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    console.log(exception.message);

    response.status(status).json({
      status: false,
      // !NOTE: I'm responding the error message to facilitate debugging but it's not a good practice at all
      data: exception.message || 'Internal server error',
    });
  }
}
