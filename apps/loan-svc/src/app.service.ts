import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  create(createLoanDto: any) {
    console.log('Creating loan', createLoanDto);
    return { status: 'created' };
  }

  findOne(id: string) {
    console.log('Getting loan', id);
    return { id, status: 'pending' };
  }

  fund(fundDto: any) {
    console.log('Funding loan', fundDto);
    return { status: 'funded' };
  }

  disburse(id: string) {
    console.log('Disbursing loan', id);
    return { status: 'disbursed' };
  }

  repay(repaymentDto: any) {
    console.log('Repaying loan', repaymentDto);
    return { status: 'repaid' };
  }
}
