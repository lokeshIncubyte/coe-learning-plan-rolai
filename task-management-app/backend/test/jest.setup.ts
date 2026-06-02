// Load .env so providers that read process.env (e.g. JWT_SECRET for
// passport-jwt JwtStrategy) construct correctly under Jest, mirroring main.ts.
import 'dotenv/config';

// Fallback secret for environments without a populated .env (e.g. CI).
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
