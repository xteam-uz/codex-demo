import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BOT_TOKEN: z.string().min(10),
  WEBHOOK_SECRET: z.string().min(8),
  WEBHOOK_PATH: z.string().default("/telegram/webhook"),
  WEBHOOK_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url().optional(),
  DEFAULT_LANGUAGE: z.enum(["en", "uz"]).default("en")
});

export const config = schema.parse(process.env);
