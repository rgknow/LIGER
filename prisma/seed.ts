import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LIGER platform database...');

  // Create sample students
  const student1 = await prisma.student.create({
    data: {
      id: 'student-1',
      userId: 'user-student-1',
      parentId: 'user-parent-1',
      scs: 75.5,
      scsBreakdown: {
        Agency: 80,
        SEL: 75,
        Financial: 70,
        Digital: 85,
        Mindset: 78,
        Entrepreneurship: 65
      },
      walletBalance: 250.0,
    }
  });

  const student2 = await prisma.student.create({
    data: {
      id: 'student-2',
      userId: 'user-student-2',
      parentId: 'user-parent-2',
      scs: 68.2,
      scsBreakdown: {
        Agency: 70,
        SEL: 68,
        Financial: 65,
        Digital: 72,
        Mindset: 70,
        Entrepreneurship: 64
      },
      walletBalance: 150.0,
    }
  });

  // Create sample wallet transactions
  await prisma.walletTransaction.create({
    data: {
      studentId: student1.id,
      type: 'credit',
      source: 'gift',
      amount: 100.0,
      balance: 250.0,
      metaJson: { 
        giftEvent: 'Birthday Campaign',
        donor: 'Grandma'
      }
    }
  });

  await prisma.walletTransaction.create({
    data: {
      studentId: student1.id,
      type: 'credit',
      source: 'chore',
      amount: 25.0,
      balance: 175.0,
      metaJson: {
        task: 'Weekly room cleaning',
        streak: 4
      }
    }
  });

  // Create proposal templates
  await prisma.proposalTemplate.create({
    data: {
      type: 'investment',
      fields: {
        vertical: { type: 'select', options: ['real-estate', 'stocks', 'commodities', 'crypto', 'p2p-lending'] },
        instrument: { type: 'string', label: 'Investment Instrument' },
        amount: { type: 'number', min: 10, max: 1000 },
        rationale: { type: 'text', label: 'Why this investment?' }
      },
      version: 1
    }
  });

  await prisma.proposalTemplate.create({
    data: {
      type: 'gift_use',
      fields: {
        category: { type: 'select', options: ['education', 'hobby', 'charity', 'savings'] },
        item: { type: 'string', label: 'What do you want to buy?' },
        amount: { type: 'number', min: 5, max: 500 },
        justification: { type: 'text', label: 'Why do you need this?' }
      },
      version: 1
    }
  });

  // Create sample proposals
  const proposal1 = await prisma.proposal.create({
    data: {
      studentId: student1.id,
      vertical: 'stocks',
      type: 'investment',
      status: 'submitted',
      riskLevel: 'Medium',
      scsSnapshot: 75.5,
      briefJson: {
        instrument: 'AAPL',
        amount: 100,
        rationale: 'Apple has strong fundamentals and I want to learn about tech stocks',
        riskFactors: ['Market volatility', 'Single stock concentration'],
        learningObjectives: ['Understanding P/E ratios', 'Dividend investing', 'Market timing']
      },
      submittedAt: new Date()
    }
  });

  const proposal2 = await prisma.proposal.create({
    data: {
      studentId: student2.id,
      vertical: 'real-estate',
      type: 'investment',
      status: 'approved',
      riskLevel: 'Low',
      scsSnapshot: 68.2,
      briefJson: {
        instrument: 'REIT Fund A',
        amount: 75,
        rationale: 'Real estate is a good hedge against inflation',
        riskFactors: ['Interest rate sensitivity'],
        learningObjectives: ['Understanding REITs', 'Diversification benefits']
      },
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      parentDecisionAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      executedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  });

  // Create approval for proposal2
  await prisma.approval.create({
    data: {
      proposalId: proposal2.id,
      parentId: 'user-parent-2',
      decision: 'approve',
      signature: 'parent-signature-hash-' + Date.now(),
      comment: 'Good research on REITs. Approved for learning purposes.',
      requires2FA: false
    }
  });

  // Create sample gift event
  const giftEvent = await prisma.giftEvent.create({
    data: {
      studentId: student1.id,
      name: "Alice's 16th Birthday",
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active',
      qrUri: 'https://liger.club/gift/qr/birthday-alice-2025',
      progressCardJson: {
        goal: 500,
        raised: 100,
        contributors: 3,
        message: 'Help Alice save for her first investment portfolio!'
      }
    }
  });

  // Create gift catalog items
  await prisma.giftCatalogItem.create({
    data: {
      eventId: giftEvent.id,
      kind: 'token_bundle',
      ctkAmount: 25.0,
      title: 'Starter Investment Bundle',
      description: 'Help Alice start her investment journey',
      active: true
    }
  });

  await prisma.giftCatalogItem.create({
    data: {
      eventId: giftEvent.id,
      kind: 'project_goal',
      ctkAmount: 100.0,
      title: 'First Stock Purchase Goal',
      description: 'Support Alice\'s first equity investment',
      active: true
    }
  });

  // Create sample scholarship
  const scholarship = await prisma.scholarship.create({
    data: {
      sponsorId: 'sponsor-tech-corp',
      title: 'Future Tech Leaders Scholarship',
      description: 'For students showing excellence in digital literacy and entrepreneurship',
      criteriaJson: {
        minSCS: 70,
        domains: ['Digital', 'Entrepreneurship'],
        ageRange: [14, 18],
        requirements: ['Essay on tech innovation', 'Portfolio of projects']
      },
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      amountCtk: 1000.0,
      status: 'active'
    }
  });

  // Create sample habit tasks
  await prisma.habitTask.create({
    data: {
      studentId: student1.id,
      title: 'Daily Reading (30 minutes)',
      schedule: 'daily',
      status: 'active',
      streak: 12,
      totalPoints: 60.0,
      createdBy: 'user-parent-1'
    }
  });

  await prisma.habitTask.create({
    data: {
      studentId: student1.id,
      title: 'Weekly Room Organization',
      schedule: 'weekly',
      status: 'active',
      streak: 4,
      totalPoints: 80.0,
      createdBy: 'user-parent-1'
    }
  });

  // Create sample loan request
  const loanRequest = await prisma.loanRequest.create({
    data: {
      studentId: student1.id,
      parentId: 'user-parent-1',
      briefJson: {
        purpose: 'Online coding bootcamp',
        plan: 'Learn full-stack development to build my own apps',
        duration: '6 months',
        repaymentSource: 'Part-time coding projects and internships'
      },
      amountCtk: 2000.0,
      repaymentPlan: '24 months at 5% annual interest',
      status: 'draft'
    }
  });

  // Create sample dossier
  await prisma.dossier.create({
    data: {
      studentId: student1.id,
      snapshotJson: {
        scsHistory: [
          { month: '2025-07', scs: 72.1 },
          { month: '2025-08', scs: 74.8 },
          { month: '2025-09', scs: 75.5 }
        ],
        achievements: [
          'Completed 4-week investment learning module',
          'Maintained 12-day reading streak',
          'Successfully managed first REIT investment'
        ],
        proposalHistory: {
          total: 3,
          approved: 2,
          avgRiskLevel: 'Medium'
        },
        skillsBadges: ['Financial Literacy Level 2', 'Digital Wellbeing', 'Consistency Master']
      },
      hash: 'sha256-' + Date.now(),
      pdfUri: 'https://liger.club/dossiers/student-1-2025-09.pdf'
    }
  });

  console.log('✅ Seed data created successfully!');
  console.log(`Created ${await prisma.student.count()} students`);
  console.log(`Created ${await prisma.proposal.count()} proposals`);
  console.log(`Created ${await prisma.giftEvent.count()} gift events`);
  console.log(`Created ${await prisma.scholarship.count()} scholarships`);
  console.log(`Created ${await prisma.habitTask.count()} habit tasks`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });