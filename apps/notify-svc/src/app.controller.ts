import { Controller, Post, Body } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('send')
  sendNotification(@Body() notification: any) {
    return this.appService.sendNotification(notification);
  }

  // Event-driven notification handlers
  @MessagePattern({ cmd: 'proposal_submitted' })
  handleProposalSubmitted(@Payload() data: any) {
    return this.appService.notifyParentOfProposal(data);
  }

  @MessagePattern({ cmd: 'proposal_approved' })
  handleProposalApproved(@Payload() data: any) {
    return this.appService.notifyStudentOfApproval(data);
  }

  @MessagePattern({ cmd: 'proposal_rejected' })
  handleProposalRejected(@Payload() data: any) {
    return this.appService.notifyStudentOfRejection(data);
  }

  @MessagePattern({ cmd: 'gift_received' })
  handleGiftReceived(@Payload() data: any) {
    return this.appService.notifyStudentOfGift(data);
  }

  @MessagePattern({ cmd: 'scholarship_awarded' })
  handleScholarshipAwarded(@Payload() data: any) {
    return this.appService.notifyStudentOfScholarship(data);
  }

  @MessagePattern({ cmd: 'loan_funded' })
  handleLoanFunded(@Payload() data: any) {
    return this.appService.notifyStudentOfLoanFunding(data);
  }
}