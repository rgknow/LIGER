import { Controller, Get, Post, Param, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('proposal')
export class AppController {
  constructor(@Inject('PROPOSAL_SERVICE') private client: ClientProxy) {}

  @Post()
  createProposal(@Body() proposalRequest: any) {
    return this.client.send({ cmd: 'create_proposal' }, proposalRequest);
  }

  @Get(':id')
  getProposal(@Param('id') id: string) {
    return this.client.send({ cmd: 'get_proposal' }, id);
  }

  @Post(':id/approve')
  approveProposal(@Param('id') id: string) {
    return this.client.send({ cmd: 'approve_proposal' }, id);
  }

  @Post(':id/reject')
  rejectProposal(@Param('id') id: string) {
    return this.client.send({ cmd: 'reject_proposal' }, id);
  }
}