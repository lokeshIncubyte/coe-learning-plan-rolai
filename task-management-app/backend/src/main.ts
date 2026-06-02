// Must run before any Prisma/pg connection: prefer IPv4 DNS results so the
// Neon connection does not hang on an unroutable IPv6 address under WSL2.
// Inlined (not imported from scripts/) so it survives the nest build into dist/.
import * as dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
// Load .env before AppModule (and thus PrismaService) is constructed, so
// DATABASE_URL is available when running the built app (node dist/src/main.js).
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
