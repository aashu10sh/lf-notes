import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;

import { config } from "dotenv";
config();

class Database {
  private static instance: Database;
  private pool: typeof Pool;
  private db: ReturnType<typeof drizzle>;

  private constructor() {
    console.log(`url db: `, process.env.DATABASE_URL!);

    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(this.pool);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getDb() {
    return this.db;
  }
}

export default Database;
