import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  create(createScholarshipDto: any) {
    console.log('Creating scholarship', createScholarshipDto);
    return { status: 'created' };
  }

  findAll() {
    console.log('Getting all scholarships');
    return [{ id: 1, name: 'Test Scholarship' }];
  }

  apply(application: any) {
    console.log('Applying to scholarship', application);
    return { status: 'applied' };
  }

  award(award: any) {
    console.log('Awarding scholarship', award);
    return { status: 'awarded' };
  }
}
