import { Controller, Get } from '@nestjs/common';
import { CreateCategoryUseCase } from 'codeflix/category/application';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(CreateCategoryUseCase.UseCase)
    return this.appService.getHello();
  }
}
