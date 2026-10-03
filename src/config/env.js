import 'dotenv/config';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const jwtSecret =
  process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-secret' : null);
if (!jwtSecret) {
  throw new Error('JWT_SECRET is required');
}

export const env = {
  port,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret,
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
