import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局中间件，将中间件绑定到每个已注册的路由
  // 无法访问全局中间件中的 DI 容器。使用 app.use() 时可以使用 功能中间件
  // 或者，你可以使用类中间件并在 AppModule（或任何其他模块）中将其与 .forRoutes('*')
  app.use(logger);
  const port = process.env.PORT ?? 3000;
  console.log('server run on port:', port);
  await app.listen(port);
}
bootstrap();
