import { EventBusService } from '../packages/shared/event-bus.service';

async function testEventBus() {
  console.log('🧪 Testing LIGER Event Bus...');
  
  const eventBus = new EventBusService();
  
  try {
    // Connect to NATS
    await eventBus.connect();
    
    // Subscribe to test events
    await eventBus.subscribeToEvent('test.hello', async (data) => {
      console.log('📥 Received test event:', data);
    });
    
    // Publish a test event
    await eventBus.publishEvent('test.hello', {
      message: 'Hello LIGER Event Bus!',
      service: 'test-runner'
    });
    
    // Test LIGER-specific events
    await eventBus.publishEvent(EventBusService.EVENTS.PROPOSAL_CREATED, {
      proposalId: 'test-proposal-123',
      studentId: 'student-1',
      vertical: 'stocks',
      amount: 100
    });
    
    console.log('✅ Event bus test completed successfully!');
    
    // Keep alive for a moment to see events
    setTimeout(async () => {
      await eventBus.disconnect();
      process.exit(0);
    }, 2000);
    
  } catch (error) {
    console.error('❌ Event bus test failed:', error);
    process.exit(1);
  }
}

testEventBus();