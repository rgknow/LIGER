import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'lock_funds' })
  lockFunds(@Payload() payload: any) {
    return this.appService.lock(payload);
  }

  @MessagePattern({ cmd: 'release_funds' })
  releaseFunds(@Payload() payload: any) {
    return this.appService.release(payload);
  }
}
