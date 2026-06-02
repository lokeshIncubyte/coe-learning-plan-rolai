import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '../../generated/prisma/client';

const SALT_ROUNDS = 10;

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<Omit<User, 'password'>> {
    const password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    try {
      const user = await this.prisma.user.create({
        data: { name: dto.name, email: dto.email, password },
      });
      return this.stripPassword(user);
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') {
        throw new ConflictException('Email already in use');
      }
      throw e;
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return this.stripPassword(user);
  }

  login(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwt.sign(payload) };
  }

  private stripPassword(user: User): Omit<User, 'password'> {
    const { password: _omit, ...rest } = user;
    return rest;
  }
}
