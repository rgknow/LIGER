import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create_scholarship' })
  createScholarship(@Payload() createScholarshipDto: any) {
    return this.appService.create(createScholarshipDto);
  }

  @MessagePattern({ cmd: 'get_scholarships' })
  getScholarships() {
    return this.appService.findAll();
  }

  @MessagePattern({ cmd: 'apply_scholarship' })
  applyToScholarship(@Payload() application: any) {
    return this.appService.apply(application);
  }

  @MessagePattern({ cmd: 'award_scholarship' })
  awardScholarship(@Payload() award: any) {
    return this.appService.award(award);
  }
}
