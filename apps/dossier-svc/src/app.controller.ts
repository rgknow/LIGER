import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'generate_dossier' })
  generateDossier(@Payload() payload: any) {
    return this.appService.generate(payload);
  }

  @MessagePattern({ cmd: 'get_dossier' })
  getDossier(@Payload() id: string) {
    return this.appService.findOne(id);
  }
}
