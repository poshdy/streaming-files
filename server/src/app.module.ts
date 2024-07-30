import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { LoggerMiddleware } from './middleware/logger';

@Module({
  imports: [FileModule],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
