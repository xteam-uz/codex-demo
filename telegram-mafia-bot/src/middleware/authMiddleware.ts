import type { MiddlewareFn } from "grammy";
import { UserRepository } from "../repositories/UserRepository.js";
import type { BotContext } from "../types/bot.js";

export function createAuthMiddleware(userRepo: UserRepository): MiddlewareFn<BotContext> {
  return async (ctx, next) => {
    if (ctx.from) {
      await userRepo.upsertUser(String(ctx.from.id), ctx.from.first_name, ctx.from.username);
    }
    await next();
  };
}
