import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  lock(payload: any) {
    console.log('Locking funds', payload);
    return { status: 'locked' };
  }

  release(payload: any) {
    console.log('Releasing funds', payload);
    return { status: 'released' };
  }
}
