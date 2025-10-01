import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  generate(payload: any) {
    console.log('Generating dossier', payload);
    return { status: 'generated', pdf_uri: '...' };
  }

  findOne(id: string) {
    console.log('Getting dossier', id);
    return { id, status: 'found' };
  }
}
