import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catsService: CatsService,
  ) {}

  @Get()
  getHello() {
    // return this.appService.getHello();
    // console.log(this.catsService);
    return this.catsService.findAll();
  }
}
