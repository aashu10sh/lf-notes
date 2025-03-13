import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/models/*",
  out: "./drizzle",
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
