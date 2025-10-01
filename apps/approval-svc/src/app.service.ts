import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  
  getPendingProposals() {
    // Mock implementation - should fetch from database
    console.log('Getting all pending proposals');
    return {
      proposals: [
        {
          id: '1',
          studentName: 'Alice',
          type: 'investment',
          vertical: 'stocks',
          amount: 100,
          riskLevel: 'Medium',
          submittedAt: new Date(),
        }
      ]
    };
  }

  getProposalBrief(proposalId: string) {
    console.log('Getting proposal brief for:', proposalId);
    return {
      id: proposalId,
      student: { name: 'Alice', scs: 75 },
      proposal: {
        type: 'investment',
        vertical: 'stocks',
        instrument: 'AAPL',
        amount: 100,
        riskAssessment: 'Medium risk - student has good SCS track record',
        learningPoints: ['Diversification', 'Market volatility', 'Long-term thinking']
      },
      timeline: { submittedAt: new Date(), deadline: new Date() }
    };
  }

  approveProposal(proposalId: string, approvalDto: any) {
    console.log('Approving proposal:', proposalId, approvalDto);
    
    // Generate digital signature
    const signature = this.generateDigitalSignature(proposalId, 'approve', approvalDto);
    
    return {
      status: 'approved',
      signature,
      timestamp: new Date(),
      nextSteps: ['Funds will be debited from CTK wallet', 'Position tokens will be minted']
    };
  }

  rejectProposal(proposalId: string, rejectionDto: any) {
    console.log('Rejecting proposal:', proposalId, rejectionDto);
    
    const signature = this.generateDigitalSignature(proposalId, 'reject', rejectionDto);
    
    return {
      status: 'rejected',
      signature,
      timestamp: new Date(),
      reason: rejectionDto.comment
    };
  }

  reviseProposal(proposalId: string, revisionDto: any) {
    console.log('Requesting revision for proposal:', proposalId, revisionDto);
    
    const signature = this.generateDigitalSignature(proposalId, 'revise', revisionDto);
    
    return {
      status: 'revision_requested',
      signature,
      timestamp: new Date(),
      feedback: revisionDto.comment
    };
  }

  getPendingProposalsByParent(parentId: string) {
    console.log('Getting pending proposals for parent:', parentId);
    return {
      proposals: [
        {
          id: '1',
          studentId: 'student-1',
          type: 'investment',
          status: 'submitted',
          submittedAt: new Date()
        }
      ]
    };
  }

  processApproval(data: any) {
    console.log('Processing approval:', data);
    
    // Validate approval requirements
    const requiresTwoFA = this.checkIfRequiresTwoFA(data);
    
    return {
      processed: true,
      requiresTwoFA,
      auditTrail: {
        approvalId: 'approval-' + Date.now(),
        timestamp: new Date(),
        parentSignature: data.signature
      }
    };
  }

  private generateDigitalSignature(proposalId: string, decision: string, data: any): string {
    // In production, this would use proper cryptographic signing
    const payload = `${proposalId}:${decision}:${JSON.stringify(data)}:${Date.now()}`;
    return Buffer.from(payload).toString('base64');
  }

  private checkIfRequiresTwoFA(data: any): boolean {
    // High risk proposals require 2FA
    return data.riskLevel === 'High' || data.amount > 1000;
  }
}