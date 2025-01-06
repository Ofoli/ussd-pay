import path from "path";

const APP_DIR = path.join(__dirname, "..", "..");
const DB_DIR = path.join(APP_DIR, "src", "db");
const LOGS_DIR = path.join(APP_DIR, "logs");

export const NALO_PAYMENT_URL = "https://api.nalosolutions.com/payplus/api/";
export const BASE_URL = "http:/localhost:";
export const USSD_ENPOINT = "/ussd/app";
export const PAYMENT_CALLBACK_ENDPOINT = "/payment/callback";
export const DB_MIGRATION_DIR = path.join(DB_DIR, "migrations");
export const DB_SCHEMA_PATH = path.join(DB_DIR, "schema.ts");
export const ENV_FILE_PATH = path.join(APP_DIR, ".env");
export const APP_LOG_PATH = path.join(LOGS_DIR, "app.log");
