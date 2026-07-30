/** @type {import("drizzle-kit").Config} */

export default {
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL + "?sslmode=require",
  },
};