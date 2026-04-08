# Telegram Mafia + Moderation Bot (TypeScript + grammY)

Production-oriented Telegram bot with a multiplayer Mafia game and group moderation.

## Folder Structure

```text
telegram-mafia-bot/
  prisma/
    schema.prisma
  src/
    bot.ts
    core/
      config.ts
      database.ts
      logger.ts
      router.ts
    middleware/
      antiSpamMiddleware.ts
      authMiddleware.ts
      errorMiddleware.ts
    modules/
      game/
      moderation/
      user/
      group/
    repositories/
      GameRepository.ts
      GroupRepository.ts
      UserRepository.ts
    services/
      GameService.ts
      ModerationService.ts
      RoomService.ts
      WarningService.ts
    types/
      bot.ts
    utils/
      i18n.ts
  .env.example
  package.json
  tsconfig.json
```

## Features

- Webhook-only runtime (production-safe).
- Strict TypeScript typing.
- Prisma schema with core game/moderation tables.
- Group moderation:
  - admin permission checks
  - welcome message per-group settings
  - anti-link detection + warning escalation
  - `/warn`, `/unwarn`, `/warnings`
- Mafia gameplay:
  - room creation/join/leave
  - role assignment (Mafia, Doctor, Detective, Civilian)
  - phase machine (`waiting -> night -> day -> voting -> result -> ...`)
  - private-chat role delivery and voting callbacks
  - win conditions
- i18n dictionary for English/Uzbek.
- anti-spam middleware and graceful shutdown.

## Setup

1. Copy env file:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
5. Start locally:
   ```bash
   npm run dev
   ```

## Example Webhook Setup

The bot sets webhook automatically at startup:

```ts
await bot.api.setWebhook(`${config.WEBHOOK_URL}${config.WEBHOOK_PATH}`, {
  secret_token: config.WEBHOOK_SECRET,
  allowed_updates: ["message", "chat_member", "callback_query"]
});
```

Telegram should send updates to:

```text
POST https://your-domain.com/telegram/webhook
Header: X-Telegram-Bot-Api-Secret-Token: <WEBHOOK_SECRET>
```

## Example Gameplay Walkthrough

1. Add bot as **group admin** with:
   - delete messages
   - restrict members
2. Group: `/create`
3. Players: `/join`
4. Start: `/begin`
5. Bot DMs each player role.
6. Night actions happen in private chat.
7. Day + voting starts in group.
8. Players DM `/vote`, choose target via inline keyboard.
9. Bot evaluates round and win conditions:
   - Mafia alive >= Civilians alive => Mafia wins
   - Mafia alive = 0 => Civilians win

## Production Notes

- For horizontal scaling, move timers to Redis queue (BullMQ) and use distributed locks.
- Add real authz for admin-only commands (`/warn`, `/settings`).
- Add OpenTelemetry + centralized logging.
