import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ToHexPipe } from 'src/common/pipe/to-hex.pipe';
import { IsNotEmpty } from 'class-validator';
import { NotEmptyPipe } from 'src/common/pipe/not-empty.pipe';
import { ConfigService } from '@nestjs/config';
// import { ValidationPipe } from 'src/common/pipe/validation.pipe';

@Controller('cats')
// @UseFilters(new HttpExceptionFilter())
// @UseFilters(HttpExceptionFilter)
export class CatsController {
  // 构造函数注入，推荐使用
  constructor(
    private catsService: CatsService,
    private configService: ConfigService,
  ) {}

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

  @Get('throw')
  // @UseFilters(new HttpExceptionFilter())
  // 尽可能使用类而不是示例来应用过滤器，它减少了内存使用量，因为 Nest 可以轻松地在整个模块中重用同一类的实例
  // @UseFilters(HttpExceptionFilter)
  throwException() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get('findOne/:id')
  // 添加 ParseIntPipe 对请求参数进行转换
  // 如果转换失败，将抛出异常，并将阻止方法主体的执行
  findOne(
    // @Param('id', ParseIntPipe)
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: any,
  ) {
    console.log(typeof id);
    return `id + 5 = ${id + 5}`;
  }

  @Get('findOne')
  findOneV2(@Query('id', ParseIntPipe) id: number) {
    return `id + 10 = ${id + 10}`;
  }

  @Post('validate')
  validate(@Body('id', ValidationPipe) id: number) {
    return `validate ${id}`;
  }

  @Get('toHex')
  toHex(@Query('age', ToHexPipe) age: number) {
    return 'age = ' + age;
  }

  /** 提供默认值的管道 demo */
  @Get('setAge')
  setAge(
    @Query('name', NotEmptyPipe) name: string,
    @Query('age', new DefaultValuePipe(6), ParseIntPipe) age: number,
  ) {
    return `set ${name} to ${age} years old`;
  }

  @Get('config/http/:field')
  getHttpConfig(@Param('field') field: string) {
    return this.configService.get<string>(`http.${field}`);
  }
}
