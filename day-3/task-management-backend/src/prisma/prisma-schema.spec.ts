import { execSync } from 'child_process';
import { TaskStatus } from '../../generated/prisma/enums';

describe('Prisma schema — Task model', () => {
  it('prisma validate passes with Task model defined', () => {
    // Throws if schema is invalid
    const output = execSync('npx prisma validate', { encoding: 'utf8' });
    expect(output).toMatch(/valid/i);
  });

  it('TaskStatus enum has all three values', () => {
    expect(TaskStatus.OPEN).toBe('OPEN');
    expect(TaskStatus.IN_PROGRESS).toBe('IN_PROGRESS');
    expect(TaskStatus.DONE).toBe('DONE');
  });
});
