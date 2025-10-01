import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connected to LIGER database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Disconnected from LIGER database');
  }

  // Helper methods for common operations
  async createWalletTransaction(data: {
    studentId: string;
    type: string;
    source: string;
    amount: number;
    metaJson?: any;
  }) {
    // Get current balance
    const student = await this.student.findUnique({
      where: { id: data.studentId }
    });
    
    if (!student) {
      throw new Error('Student not found');
    }

    const newBalance = data.type === 'credit' 
      ? student.walletBalance + data.amount
      : student.walletBalance - data.amount;

    // Create transaction and update balance atomically
    return this.$transaction(async (tx) => {
      const transaction = await tx.walletTransaction.create({
        data: {
          studentId: data.studentId,
          type: data.type,
          source: data.source,
          amount: data.amount,
          balance: newBalance,
          metaJson: data.metaJson || {}
        }
      });

      await tx.student.update({
        where: { id: data.studentId },
        data: { walletBalance: newBalance }
      });

      return transaction;
    });
  }

  async updateSCS(studentId: string, newSCS: number, breakdown: any) {
    return this.student.update({
      where: { id: studentId },
      data: {
        scs: newSCS,
        scsBreakdown: breakdown,
        updatedAt: new Date()
      }
    });
  }

  async createProposalAudit(proposalId: string, event: string, actor: string, metaJson: any = {}) {
    return this.proposalAudit.create({
      data: {
        proposalId,
        event,
        actor,
        metaJson
      }
    });
  }

  async getStudentDashboard(studentId: string) {
    const student = await this.student.findUnique({
      where: { id: studentId },
      include: {
        proposals: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        walletTxns: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        habitTasks: {
          where: { status: 'active' }
        },
        giftEvents: {
          where: { status: 'active' }
        }
      }
    });

    return student;
  }

  async getParentDashboard(parentId: string) {
    const students = await this.student.findMany({
      where: { parentId },
      include: {
        proposals: {
          where: { status: 'submitted' },
          orderBy: { submittedAt: 'desc' }
        },
        walletTxns: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    const pendingProposals = await this.proposal.findMany({
      where: {
        status: 'submitted',
        student: { parentId }
      },
      include: {
        student: true
      },
      orderBy: { submittedAt: 'desc' }
    });

    return {
      students,
      pendingProposals,
      totalStudents: students.length,
      totalPendingApprovals: pendingProposals.length
    };
  }
}