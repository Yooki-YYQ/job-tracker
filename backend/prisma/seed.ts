import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with test data...');

  // Create sample applications
  const applications = await Promise.all([
    prisma.application.create({
      data: {
        data: {
          companyName: 'Google',
          positionTitle: 'Software Engineer',
          jobUrl: 'https://careers.google.com/jobs/results/1234567890',
          applicationDate: '2024-01-15',
          status: 'APPLIED',
          location: 'Mountain View, CA',
          salary: '$120,000 - $180,000',
          jobType: 'Full-time',
          jobDescription: 'We are looking for a talented Software Engineer to join our team...',
          qualifications: 'Bachelor\'s degree in Computer Science or related field. 3+ years of experience with React, Node.js, and TypeScript.',
          notes: 'Applied through company website. Waiting for response.'
        }
      }
    }),
    prisma.application.create({
      data: {
        data: {
          companyName: 'Microsoft',
          positionTitle: 'Frontend Developer',
          jobUrl: 'https://careers.microsoft.com/us/en/job/1234567',
          applicationDate: '2024-01-20',
          status: 'INTERVIEW_SCHEDULED',
          location: 'Seattle, WA',
          salary: '$110,000 - $160,000',
          jobType: 'Full-time',
          jobDescription: 'Join our team as a Frontend Developer working on cutting-edge web applications...',
          qualifications: 'Strong experience with React, TypeScript, and modern web development practices.',
          notes: 'Interview scheduled for next week. Very excited about this opportunity!'
        }
      }
    }),
    prisma.application.create({
      data: {
        data: {
          companyName: 'Apple',
          positionTitle: 'iOS Developer',
          jobUrl: 'https://jobs.apple.com/en-us/details/123456789',
          applicationDate: '2024-01-25',
          status: 'INTERVIEWED',
          location: 'Cupertino, CA',
          salary: '$130,000 - $190,000',
          jobType: 'Full-time',
          jobDescription: 'We are seeking an experienced iOS Developer to join our mobile team...',
          qualifications: '5+ years of iOS development experience. Proficiency in Swift and Objective-C.',
          notes: 'Interview went well. Waiting for final decision.'
        }
      }
    }),
    prisma.application.create({
      data: {
        data: {
          companyName: 'Netflix',
          positionTitle: 'Full Stack Engineer',
          jobUrl: 'https://jobs.netflix.com/jobs/1234567',
          applicationDate: '2024-02-01',
          status: 'OFFER_RECEIVED',
          location: 'Los Gatos, CA',
          salary: '$140,000 - $200,000',
          jobType: 'Full-time',
          jobDescription: 'Join Netflix as a Full Stack Engineer working on our streaming platform...',
          qualifications: 'Experience with React, Node.js, Python, and cloud technologies.',
          notes: 'Received offer! Negotiating salary and benefits.'
        }
      }
    }),
    prisma.application.create({
      data: {
        data: {
          companyName: 'Amazon',
          positionTitle: 'Backend Developer',
          jobUrl: 'https://www.amazon.jobs/en/jobs/1234567',
          applicationDate: '2024-02-05',
          status: 'REJECTED',
          location: 'Seattle, WA',
          salary: '$115,000 - $170,000',
          jobType: 'Full-time',
          jobDescription: 'Amazon is looking for a Backend Developer to join our AWS team...',
          qualifications: 'Strong background in distributed systems and cloud computing.',
          notes: 'Rejected after technical interview. Need to improve system design skills.'
        }
      }
    })
  ]);

  console.log(`✅ Created ${applications.length} sample applications`);

  // Create some sample files for the first application
  await prisma.applicationFile.createMany({
    data: [
      {
        applicationId: applications[0].id,
        fileName: 'John_Doe_Resume.pdf',
        filePath: 'uploads/resume_12345.pdf',
        uploadedAt: new Date()
      },
      {
        applicationId: applications[0].id,
        fileName: 'Cover_Letter_Google.docx',
        filePath: 'uploads/cover_letter_67890.docx',
        uploadedAt: new Date()
      }
    ]
  });

  console.log('✅ Created sample files');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
