import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- CREATE ---');
  const task = await prisma.task.create({
    data: { title: 'Learn Prisma', description: 'Practice CRUD against Neon' },
  });
  console.log('created:', task);

  console.log('\n--- FIND MANY ---');
  const all = await prisma.task.findMany();
  console.log('all tasks:', all);

  console.log('\n--- FIND UNIQUE ---');
  const found = await prisma.task.findUnique({ where: { id: task.id } });
  console.log('found:', found);

  console.log('\n--- UPDATE ---');
  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { status: 'IN_PROGRESS' },
  });
  console.log('updated:', updated);

  console.log('\n--- DELETE ---');
  await prisma.task.delete({ where: { id: task.id } });
  console.log('deleted id:', task.id);

  console.log('\n--- FIND MANY (after delete) ---');
  const remaining = await prisma.task.findMany();
  console.log('remaining tasks:', remaining);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
