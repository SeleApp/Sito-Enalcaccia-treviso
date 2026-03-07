import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL not set - falling back to in-memory storage");
}

export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : (undefined as unknown as Pool);

export const db = databaseUrl
  ? drizzle({ client: pool, schema })
  : (undefined as unknown as ReturnType<typeof drizzle>);