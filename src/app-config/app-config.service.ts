import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerConfig } from './interfaces/server-config.interface';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}
  getServer() {
    return this.configService.get<ServerConfig>('server');
  }
}
