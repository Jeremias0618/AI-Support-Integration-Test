import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { ApiRootStatus } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): ApiRootStatus {
    return this.appService.getRootStatus();
  }
}
