import dotenv from "dotenv";
import {
  USSD_ENPOINT,
  BASE_URL,
  PAYMENT_CALLBACK_ENDPOINT,
  NALO_PAYMENT_URL,
  DB_MIGRATION_DIR,
  DB_SCHEMA_PATH,
  ENV_FILE_PATH,
} from "./constants";

dotenv.config({ path: ENV_FILE_PATH });

export const config = {
  app: {
    baseUrl: BASE_URL,
    port: process.env.PORT,
  },
  db: {
    url: "sqlite.db",
    migrationDirPath: DB_MIGRATION_DIR,
    schemaFilePath: DB_SCHEMA_PATH,
  },
  endpoints: {
    ussd: USSD_ENPOINT,
    paymentCallback: PAYMENT_CALLBACK_ENDPOINT,
  },
  payment: {
    naloUrl: NALO_PAYMENT_URL,
  },
};
