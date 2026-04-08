import type { MiddlewareFn } from "grammy";
import type { BotContext } from "../types/bot.js";

const WINDOW_MS = 10_000;
const MAX_HITS = 8;

export const antiSpamMiddleware: MiddlewareFn<BotContext> = async (ctx, next) => {
  const now = Date.now();
  const limiter = ctx.session.rateLimiter;
  if (now - limiter.windowStartedAt > WINDOW_MS) {
    limiter.windowStartedAt = now;
    limiter.hits = 0;
  }
  limiter.hits += 1;
  if (limiter.hits > MAX_HITS) return;
  await next();
};
