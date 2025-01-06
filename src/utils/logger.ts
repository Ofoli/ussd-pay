import winston from "winston";
import { config } from "../config/env";

const { timestamp, printf, combine } = winston.format;
const formatter = (log: winston.Logform.TransformableInfo) =>
  `${log.timestamp} - ${log.level.toUpperCase()} - ${JSON.stringify(
    log.message
  )}`;

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    printf(formatter)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: config.app.logs.default }),
  ],
});
