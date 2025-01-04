import { drizzle } from "drizzle-orm/better-sqlite3";
import { config } from "../config/env";

export const db = drizzle(config.db.url);
