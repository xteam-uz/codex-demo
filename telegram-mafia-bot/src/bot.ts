import { Bot, webhookCallback, session } from "grammy";
import { createServer } from "node:http";
import { conversations, createConversation } from "@grammyjs/conversations";
import { config } from "./core/config.js";
import { logger } from "./core/logger.js";
import { prisma } from "./core/database.js";
import type { BotContext, BotSession } from "./types/bot.js";
import { createAuthMiddleware } from "./middleware/authMiddleware.js";
import { antiSpamMiddleware } from "./middleware/antiSpamMiddleware.js";
import { bindErrorHandler } from "./middleware/errorMiddleware.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { GroupRepository } from "./repositories/GroupRepository.js";
import { GameRepository } from "./repositories/GameRepository.js";
import { WarningService } from "./services/WarningService.js";
import { ModerationService } from "./services/ModerationService.js";
import { RoomService } from "./services/RoomService.js";
import { GameService } from "./services/GameService.js";
import { registerRoutes } from "./core/router.js";

const bot = new Bot<BotContext>(config.BOT_TOKEN);

const initial = (): BotSession => ({
  locale: config.DEFAULT_LANGUAGE,
  rateLimiter: { hits: 0, windowStartedAt: Date.now() }
});

async function localeConversation() {
  // conversation extension point
}

bot.use(session({ initial }));
bot.use(conversations());
bot.use(createConversation(localeConversation));

const userRepo = new UserRepository(prisma);
const groupRepo = new GroupRepository(prisma);
const gameRepo = new GameRepository(prisma);
const warningService = new WarningService(prisma);
const moderationService = new ModerationService(groupRepo, warningService);
const roomService = new RoomService(gameRepo);
const gameService = new GameService(gameRepo);

bot.use(createAuthMiddleware(userRepo));
bot.use(antiSpamMiddleware);

registerRoutes(bot, {
  moderationService,
  roomService,
  gameService,
  warningService,
  groupRepository: groupRepo
});

bindErrorHandler(bot);

const handler = webhookCallback(bot, "http", {
  secretToken: config.WEBHOOK_SECRET
});

const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("ok");
    return;
  }

  if (req.url === config.WEBHOOK_PATH && req.method === "POST") {
    void handler(req, res);
    return;
  }

  res.writeHead(404);
  res.end("not found");
});

async function bootstrap(): Promise<void> {
  await bot.api.setWebhook(`${config.WEBHOOK_URL}${config.WEBHOOK_PATH}`, {
    secret_token: config.WEBHOOK_SECRET,
    allowed_updates: ["message", "chat_member", "callback_query"]
  });

  server.listen(config.PORT, () => {
    logger.info({ port: config.PORT }, "Bot server started");
  });
}

void bootstrap();

async function shutdown(): Promise<void> {
  logger.info("Shutting down gracefully...");
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
