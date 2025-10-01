import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create_proposal' })
  createProposal(@Payload() proposalRequest: any): any {
    return this.appService.createProposal(proposalRequest);
  }

  @MessagePattern({ cmd: 'get_proposal' })
  getProposal(@Payload() id: string): any {
    return this.appService.getProposal(id);
  }

  @MessagePattern({ cmd: 'approve_proposal' })
  approveProposal(@Payload() id: string): any {
    return this.appService.approveProposal(id);
  }

  @MessagePattern({ cmd: 'reject_proposal' })
  rejectProposal(@Payload() id: string): any {
    return this.appService.rejectProposal(id);
  }
}