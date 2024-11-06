import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Inject,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  // 构造函数注入，推荐使用
  constructor(private catsService: CatsService) {}

  // 属性注入
  //   @Inject()
  //   private readonly catsService: CatsService;

  @Post()
  create(): string {
    return 'this action adds a new cat';
  }

  @Get()
  @HttpCode(201) // 设置返回值的状态码
  findAll() {
    return this.catsService.findAll();
  }

  @Get('ab*cd') // 使用通配符路由，仅 express 支持路由中间的通配符
  abcd() {
    return 'this route uses a wildcard';
  }

  @Get('fff')
  @Header('fff', '18')
  customResponseHeader() {
    return 'set custom response header';
  }

  @Get('ggg')
  @Redirect('localhost:3000/cats/fff') // 设置重定向(浏览器会自动重定向)
  redirect() {}

  @Get('detail/:id')
  // @Param 修饰方法参数，使路由参数可用作方法体内该修饰方法参数的属性
  detail(@Param() params: any): string {
    return `show detail of id${params.id}`;
  }

  @Get('show/:id')
  // @Param 允许带参，表示获取指定参数
  show(@Param('id') id: number) {
    return `get id = ${id}`;
  }

  @Post('createCat')
  createCat(@Body() dto: CreateCatDto) {
    // 发送时指定 --header 'content-type: application/json' 才能被正常接收
    this.catsService.create(dto);
    return `createCat: name = ${dto.name}, age = ${dto.age}, breed = ${dto.breed}`;
  }
}
