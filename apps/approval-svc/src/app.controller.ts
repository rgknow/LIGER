import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // HTTP endpoints for Parent App
  @Get('proposals/pending')
  getPendingProposals() {
    return this.appService.getPendingProposals();
  }

  @Get('proposals/:id/brief')
  getProposalBrief(@Param('id') id: string) {
    return this.appService.getProposalBrief(id);
  }

  @Post('proposals/:id/approve')
  approveProposal(@Param('id') id: string, @Body() approvalDto: any) {
    return this.appService.approveProposal(id, approvalDto);
  }

  @Post('proposals/:id/reject')
  rejectProposal(@Param('id') id: string, @Body() rejectionDto: any) {
    return this.appService.rejectProposal(id, rejectionDto);
  }

  @Post('proposals/:id/revise')
  reviseProposal(@Param('id') id: string, @Body() revisionDto: any) {
    return this.appService.reviseProposal(id, revisionDto);
  }

  // Microservice message patterns
  @MessagePattern({ cmd: 'get_pending_proposals' })
  handleGetPendingProposals(@Payload() parentId: string) {
    return this.appService.getPendingProposalsByParent(parentId);
  }

  @MessagePattern({ cmd: 'process_approval' })
  handleProcessApproval(@Payload() data: any) {
    return this.appService.processApproval(data);
  }
}