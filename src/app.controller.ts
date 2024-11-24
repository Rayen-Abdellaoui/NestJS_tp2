
import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common-module/common-module.service';
@Controller()
export class AppController {
  constructor(private readonly commonService: CommonService) {}

  @Get('uuid')
  getUuid(): string {
    return this.commonService.generateUuid();
  }
}