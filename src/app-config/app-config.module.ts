import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      //   isGlobal: true,
      load: [configuration],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
