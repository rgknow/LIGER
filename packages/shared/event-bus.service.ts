import { Injectable } from '@nestjs/common';
import { connect, NatsConnection, StringCodec } from 'nats';

@Injectable()
export class EventBusService {
  private connection: NatsConnection | null = null;
  private sc = StringCodec();

  async connect() {
    try {
      this.connection = await connect({ 
        servers: process.env.NATS_URL || 'nats://localhost:4222',
        reconnect: true,
        maxReconnectAttempts: 10,
        reconnectTimeWait: 1000
      });
      console.log('✅ Connected to NATS event bus');
      
      // Setup graceful shutdown
      this.connection.closed().then(() => {
        console.log('🔌 NATS connection closed');
      });

    } catch (error) {
      console.error('❌ Failed to connect to NATS:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  // Publish events
  async publishEvent(topic: string, data: any) {
    if (!this.connection) {
      throw new Error('NATS connection not established');
    }

    const payload = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2)}`
    });

    await this.connection.publish(topic, this.sc.encode(payload));
    console.log(`📤 Published event: ${topic}`, data);
  }

  // Subscribe to events
  async subscribeToEvent(topic: string, handler: (data: any) => Promise<void>) {
    if (!this.connection) {
      throw new Error('NATS connection not established');
    }

    const subscription = this.connection.subscribe(topic);
    console.log(`📥 Subscribed to: ${topic}`);

    // Process messages
    (async () => {
      for await (const message of subscription) {
        try {
          const data = JSON.parse(this.sc.decode(message.data));
          await handler(data);
        } catch (error) {
          console.error(`❌ Error processing event ${topic}:`, error);
        }
      }
    })();

    return subscription;
  }

  // Event topics for LIGER platform
  static readonly EVENTS = {
    // Proposal events
    PROPOSAL_CREATED: 'liger.proposal.created',
    PROPOSAL_SUBMITTED: 'liger.proposal.submitted', 
    PROPOSAL_APPROVED: 'liger.proposal.approved',
    PROPOSAL_REJECTED: 'liger.proposal.rejected',
    PROPOSAL_EXECUTED: 'liger.proposal.executed',
    PROPOSAL_ANCHORED: 'liger.proposal.anchored',

    // Wallet events
    WALLET_CREDITED: 'liger.wallet.credited',
    WALLET_DEBITED: 'liger.wallet.debited',
    WALLET_ANCHORED: 'liger.wallet.anchored',

    // Gift events
    GIFT_EVENT_CREATED: 'liger.gift.event_created',
    GIFT_PAYMENT_RECEIVED: 'liger.gift.payment_received',
    GIFT_CREDITED: 'liger.gift.credited',

    // Scholarship events
    SCHOLARSHIP_LISTED: 'liger.scholarship.listed',
    SCHOLARSHIP_APPLIED: 'liger.scholarship.applied',
    SCHOLARSHIP_AWARDED: 'liger.scholarship.awarded',

    // Loan events  
    LOAN_REQUESTED: 'liger.loan.requested',
    LOAN_FUNDED: 'liger.loan.funded',
    LOAN_DISBURSED: 'liger.loan.disbursed',
    LOAN_REPAID: 'liger.loan.repaid',
    LOAN_DEFAULTED: 'liger.loan.defaulted',

    // Dossier events
    DOSSIER_GENERATED: 'liger.dossier.generated',
    DOSSIER_ANCHORED: 'liger.dossier.anchored',

    // SCS events
    SCS_UPDATED: 'liger.scs.updated',
    SCS_MILESTONE_REACHED: 'liger.scs.milestone_reached'
  };
}

// Example usage in services:
export class ProposalEventHandlers {
  constructor(private eventBus: EventBusService) {}

  async handleProposalApproved(data: any) {
    // Notify student
    await this.eventBus.publishEvent(EventBusService.EVENTS.PROPOSAL_APPROVED, {
      studentId: data.studentId,
      proposalId: data.proposalId,
      amount: data.amount,
      vertical: data.vertical
    });

    // Credit wallet (trigger wallet service)
    await this.eventBus.publishEvent(EventBusService.EVENTS.WALLET_DEBITED, {
      studentId: data.studentId,
      amount: data.amount,
      source: 'proposal_execution',
      proposalId: data.proposalId
    });
  }
}