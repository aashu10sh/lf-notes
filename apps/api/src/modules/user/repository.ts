import { drizzle } from "drizzle-orm/node-postgres";
import { UserModel } from "../../models/user";
import { eq } from "drizzle-orm";
import Database from "../../models/db";

type User = typeof UserModel.$inferInsert;

export default class UserRepository {
  constructor(private readonly db: ReturnType<typeof drizzle>) {}

  async fetchByUsername(username: string) {
    const result = await this.db
      .select()
      .from(UserModel)
      .where(eq(UserModel.username, username))
      .limit(1);

    return result[0];
  }

  async insertUser(data: User) {
    return await this.db.insert(UserModel).values(data);
  }

  static NewUserRepository() {
    return new UserRepository(Database.getInstance().getDb());
  }
}
