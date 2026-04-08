import type { Bot } from "grammy";
import { logger } from "../core/logger.js";
import type { BotContext } from "../types/bot.js";

export function bindErrorHandler(bot: Bot<BotContext>): void {
  bot.catch((err) => {
    logger.error({ err }, "Unhandled bot error");
  });
}
