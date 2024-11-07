import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { CatsService } from './cats/cats.service';
import {
  logger,
  LoggerMiddleware,
} from './common/middleware/logger.middleware';
import { RouteInfo } from '@nestjs/common/interfaces';
import { CatsController } from './cats/cats.controller';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { FileSystemModule } from './file-system/file-system.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    CatsModule,
    FileSystemModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // this.multiMiddle(consumer);
  }
  middlewareDemo(consumer: MiddlewareConsumer) {
    // 为指定路由设置中间件
    const proxy = consumer
      // apply() 方法可以采用单个中间件或多个参数来指定多个中间件
      .apply(LoggerMiddleware);
    // 针对指定路由的请求使用中间件，cats 打头的路由都会触发中间件
    // .forRoutes('cats');
    // 针对指定路由和请求方式使用中间件，仅 cats 路由会触发中间件
    // .forRoutes({ path: 'cats', method: RequestMethod.GET });
    // 支持通配符
    // .forRoutes({ path: 'cats*', method: RequestMethod.GET });
    // forRoutes() 方法可以接受单个字符串、多个字符串、一个 RouteInfo 对象、一个控制器类甚至多个控制器类
    // 在大多数情况下，你可能只会传递以逗号分隔的控制器列表,通过 exclude 排查某些路由
    proxy.exclude('cats/fff').forRoutes(CatsController);
  }
  // 函数式中间件
  functionMiddle(consumer: MiddlewareConsumer) {
    consumer
      // 函数式中间件，当你的中间件不需要任何依赖时，请考虑使用更简单的函数式中间件替代方案
      .apply(logger)
      .forRoutes('cats');
  }
  // 多个中间件
  multiMiddle(consumer: MiddlewareConsumer) {
    // 为了绑定顺序执行的多个中间件，只需在 apply() 方法中提供一个逗号分隔符的列表
    consumer.apply(LoggerMiddleware, logger).forRoutes('cats');
  }
}
