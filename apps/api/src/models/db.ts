import { drizzle } from "drizzle-orm/node-postgres";

export default async function getDatabase() {
  const db = drizzle(process.env.DATABASE_URL!);
  return db;
}
