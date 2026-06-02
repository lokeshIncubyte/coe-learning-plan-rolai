import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    strategy = new JwtStrategy();
  });

  // cycle-062 RED
  it('validate() maps the payload to { userId, email }', () => {
    const result = strategy.validate({ sub: '1', email: 'alice@example.com' });

    expect(result).toEqual({ userId: '1', email: 'alice@example.com' });
  });
});
