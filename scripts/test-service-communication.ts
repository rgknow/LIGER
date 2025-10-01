import { EventBusService } from '../packages/shared/event-bus.service';

async function testServiceCommunication() {
  console.log('🔗 Testing Inter-Service Communication via Event Bus');
  console.log('=' .repeat(50));
  
  const eventBus = new EventBusService();
  
  try {
    // Connect to NATS
    await eventBus.connect();
    console.log('✅ Connected to NATS Event Bus');

    // Simulate assessment service sending score update
    console.log('\n📊 Assessment Service: Publishing score update...');
    await eventBus.publishEvent('scoring.score.updated', {
      studentId: 'student-1',
      oldScore: 72.5,
      newScore: 75.5,
      factors: [
        { type: 'habit_completion', impact: +2.0 },
        { type: 'proposal_approved', impact: +1.0 }
      ],
      timestamp: new Date()
    });

    // Simulate proposal service creating new proposal
    console.log('📝 Proposal Service: Publishing new proposal...');
    await eventBus.publishEvent('proposal.created', {
      proposalId: 'prop-123',
      studentId: 'student-1',
      vertical: 'stocks',
      amount: 100,
      ticker: 'AAPL',
      parentId: 'parent-1',
      riskAssessment: 'Medium',
      scs: 75.5,
      timestamp: new Date()
    });

    // Simulate approval service approving proposal
    console.log('✅ Approval Service: Publishing approval decision...');
    await eventBus.publishEvent('proposal.approved', {
      proposalId: 'prop-123',
      parentId: 'parent-1',
      decision: 'APPROVED',
      comments: 'Good research on Apple stock fundamentals',
      approvedAmount: 100,
      conditions: ['Monitor for 30 days', 'Limit exposure to 10%'],
      timestamp: new Date()
    });

    // Simulate wallet service processing token transaction
    console.log('💰 Wallet Service: Publishing token transaction...');
    await eventBus.publishEvent('wallet.transaction', {
      studentId: 'student-1',
      transactionId: 'txn-456',
      type: 'INVESTMENT',
      amount: -100, // Debit for investment
      balance: 150,
      relatedProposal: 'prop-123',
      blockchainTxHash: '0xabc123...',
      timestamp: new Date()
    });

    // Simulate gift service processing reward
    console.log('🎁 Gift Service: Publishing reward distribution...');
    await eventBus.publishEvent('gift.distributed', {
      studentId: 'student-1',
      giftId: 'gift-789',
      type: 'HABIT_REWARD',
      amount: 25,
      reason: 'Weekly room cleaning completed',
      parentId: 'parent-1',
      timestamp: new Date()
    });

    // Wait a moment for all events to be processed
    console.log('\n⏳ Waiting for event propagation...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n🎉 Service Communication Test Complete!');
    console.log('📈 Events Published:');
    console.log('   • Scoring update (SCS: 72.5 → 75.5)');
    console.log('   • New investment proposal (AAPL, 100 CTK)');
    console.log('   • Proposal approval with conditions');
    console.log('   • Wallet transaction (Investment execution)');
    console.log('   • Gift reward (Habit completion bonus)');
    
    console.log('\n🔄 In a real system, these events would trigger:');
    console.log('   • Parent notifications (approval-svc)');
    console.log('   • Blockchain anchoring (blockchain-svc)');
    console.log('   • Risk recalculation (risk-svc)');
    console.log('   • Dossier updates (dossier-svc)');
    console.log('   • Performance reporting (reporting-svc)');

  } catch (error) {
    console.error('❌ Service communication test failed:', error);
  } finally {
    // Close connection
    await eventBus.disconnect();
    console.log('\n🔌 Disconnected from Event Bus');
  }
}

// Run the test
testServiceCommunication()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });