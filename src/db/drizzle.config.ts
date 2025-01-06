import { defineConfig } from "drizzle-kit";
import { config } from "../config/env";

export default defineConfig({
  schema: config.db.schemaFilePath,
  out: config.db.migrationDirPath,
  dbCredentials: {
    url: config.db.url,
  },
  dialect: "sqlite",
  verbose: true,
  strict: true,
});
