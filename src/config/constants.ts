import path from "path";

const DB_DIR = path.join(__dirname, "..", "db");

export const NALO_PAYMENT_URL = "https://api.nalosolutions.com/payplus/api/";
export const BASE_URL = "http:/localhost:";
export const USSD_ENPOINT = "/ussd/app";
export const PAYMENT_CALLBACK_ENDPOINT = "/payment/callback";
export const DB_MIGRATION_DIR = path.join(DB_DIR, "migrations");
export const DB_SCHEMA_PATH = path.join(DB_DIR, "schema.ts");
export const ENV_FILE_PATH = path.join(__dirname, "..", "..", ".env");
