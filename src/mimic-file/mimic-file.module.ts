import { Module } from '@nestjs/common';
import { MimicFileService } from './mimic-file.service';
import { MimicFileController } from './mimic-file.controller';
import { FileSystemModule } from 'src/file-system/file-system.module';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  imports: [FileSystemModule, AppConfigModule],
  providers: [MimicFileService],
  controllers: [MimicFileController],
})
export class MimicFileModule {}
