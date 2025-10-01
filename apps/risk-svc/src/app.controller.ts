import { Controller, Post, Body } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('assess')
  assessRisk(@Body() proposal: any): any {
    return this.appService.assessProposalRisk(proposal);
  }

  @MessagePattern({ cmd: 'assess_proposal_risk' })
  handleAssessRisk(@Payload() proposal: any): any {
    return this.appService.assessProposalRisk(proposal);
  }

  @MessagePattern({ cmd: 'get_risk_requirements' })
  handleGetRiskRequirements(@Payload() riskLevel: string): any {
    return this.appService.getRiskRequirements(riskLevel);
  }
}