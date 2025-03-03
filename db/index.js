import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

// Database connection setup
export const db = drizzle(process.env.DATABASE_URL);
