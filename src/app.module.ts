import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { CatsService } from './cats/cats.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RouteInfo } from '@nestjs/common/interfaces';

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 为指定路由设置中间件
    consumer
      .apply(LoggerMiddleware)
      // 针对指定路由的请求使用中间件，cats 打头的路由都会触发中间件
      // .forRoutes('cats');
      // 针对指定路由和请求方式使用中间件，仅 cats 路由会触发中间件
      // .forRoutes({ path: 'cats', method: RequestMethod.GET });
      // 支持通配符
      .forRoutes({ path: 'cats*', method: RequestMethod.GET });
  }
}
