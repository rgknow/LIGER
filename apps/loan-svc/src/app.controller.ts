import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create_loan' })
  createLoan(@Payload() createLoanDto: any) {
    return this.appService.create(createLoanDto);
  }

  @MessagePattern({ cmd: 'get_loan' })
  getLoan(@Payload() id: string) {
    return this.appService.findOne(id);
  }

  @MessagePattern({ cmd: 'fund_loan' })
  fundLoan(@Payload() fundDto: any) {
    return this.appService.fund(fundDto);
  }

  @MessagePattern({ cmd: 'disburse_loan' })
  disburseLoan(@Payload() id: string) {
    return this.appService.disburse(id);
  }

  @MessagePattern({ cmd: 'repay_loan' })
  repayLoan(@Payload() repaymentDto: any) {
    return this.appService.repay(repaymentDto);
  }
}
