import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}
  use(req: Request, res: Response, next: (error?: Error | any) => void) {
    const { method, originalUrl: url } = req;
    const reqTime = new Date().getTime();

    res.on('finish', () => {
      const { statusCode } = res;
      const resTime = new Date().getTime();
      if (statusCode == 200 || statusCode == 201) {
        this.logger.log(
          `${method} ${url} ${statusCode} - ${resTime - reqTime} ms`,
        );
      }
    });
    next();
  }
}
