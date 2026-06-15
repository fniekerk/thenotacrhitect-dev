import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  if (process.env.NODE_ENV === "production") {
    return drizzleNeon(neon(process.env.DATABASE_URL!), { schema });
  }

  // Reuse the connection across hot reloads in dev to avoid exhausting the pool.
  const g = globalThis as unknown as { _pgClient?: ReturnType<typeof postgres> };
  g._pgClient ??= postgres(process.env.DATABASE_URL!, { max: 1 });
  return drizzlePg(g._pgClient, { schema });
}

export const db = createDb();
