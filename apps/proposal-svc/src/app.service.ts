import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  createProposal(proposalRequest: any): any {
    console.log('Creating proposal', proposalRequest);
    return { status: 'created' };
  }

  getProposal(id: string): any {
    console.log('Getting proposal', id);
    return { id, status: 'pending' };
  }

  approveProposal(id: string): any {
    console.log('Approving proposal', id);
    return { id, status: 'approved' };
  }

  rejectProposal(id: string): any {
    console.log('Rejecting proposal', id);
    return { id, status: 'rejected' };
  }
}