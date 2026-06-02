import '../scripts/wsl2-ipv4.cjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: { name: 'Alice', email: 'alice@example.com' },
  });

  const bob = await prisma.user.create({
    data: { name: 'Bob', email: 'bob@example.com' },
  });

  await prisma.task.createMany({
    data: [
      { title: 'Set up CI pipeline', description: 'Configure GitHub Actions', status: 'DONE', userId: alice.id },
      { title: 'Write API docs', description: 'Document all endpoints', status: 'IN_PROGRESS', userId: alice.id },
      { title: 'Add error handling', description: 'Map Prisma errors to HTTP codes', status: 'OPEN', userId: bob.id },
      { title: 'Database seeding', description: 'Create seed script for dev data', status: 'IN_PROGRESS', userId: bob.id },
      { title: 'Deploy to production', description: 'Ship to Neon + Vercel', status: 'OPEN' },
    ],
  });

  console.log('Seeded 2 users and 5 tasks.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
