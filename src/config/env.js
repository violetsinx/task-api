import 'dotenv/config';

const port = Number.parseInt(process.env.PORT ?? '3000', 10);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

export const env = {
  port,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
