import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing LIGER database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test data retrieval
    const studentCount = await prisma.student.count();
    const proposalCount = await prisma.proposal.count();
    const giftEventCount = await prisma.giftEvent.count();
    
    console.log(`📊 Database Statistics:`);
    console.log(`   Students: ${studentCount}`);
    console.log(`   Proposals: ${proposalCount}`);
    console.log(`   Gift Events: ${giftEventCount}`);
    
    // Test a complex query
    const studentsWithProposals = await prisma.student.findMany({
      include: {
        proposals: {
          select: {
            id: true,
            vertical: true,
            status: true,
            createdAt: true
          }
        },
        walletTxns: {
          select: {
            type: true,
            amount: true,
            source: true
          },
          take: 3
        }
      }
    });
    
    console.log('\n👥 Students with Proposals:');
    studentsWithProposals.forEach(student => {
      console.log(`   ${student.id}: SCS ${student.scs}, Balance ${student.walletBalance} CTK`);
      console.log(`     Proposals: ${student.proposals.length}`);
      console.log(`     Recent Transactions: ${student.walletTxns.length}`);
    });
    
    // Test pending proposals for parents
    const pendingProposals = await prisma.proposal.findMany({
      where: { status: 'submitted' },
      include: {
        student: {
          select: {
            id: true,
            scs: true,
            parentId: true
          }
        }
      }
    });
    
    console.log(`\n⏳ Pending Parent Approvals: ${pendingProposals.length}`);
    pendingProposals.forEach(proposal => {
      const briefJson = proposal.briefJson as any;
      console.log(`   ${proposal.id}: ${proposal.vertical} - ${briefJson?.amount || 'N/A'} CTK`);
      console.log(`     Student SCS: ${proposal.student.scs}, Risk: ${proposal.riskLevel}`);
    });
    
    console.log('\n🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();