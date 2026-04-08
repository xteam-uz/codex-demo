import { InlineKeyboard } from "grammy";
import type { Bot } from "grammy";
import type { BotContext } from "../types/bot.js";
import { t } from "../utils/i18n.js";
import { ModerationService } from "../services/ModerationService.js";
import { RoomService } from "../services/RoomService.js";
import { GameService } from "../services/GameService.js";
import { WarningService } from "../services/WarningService.js";
import { GroupRepository } from "../repositories/GroupRepository.js";

interface RouterDeps {
  moderationService: ModerationService;
  roomService: RoomService;
  gameService: GameService;
  warningService: WarningService;
  groupRepository: GroupRepository;
}

export function registerRoutes(bot: Bot<BotContext>, deps: RouterDeps): void {
  bot.command("start", async (ctx) => {
    await ctx.reply(t(ctx.session.locale, "start"));
  });

  bot.command("create", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private" || !ctx.from) return;
    await deps.groupRepository.upsertGroup(String(ctx.chat.id), "title" in ctx.chat ? ctx.chat.title : "Group");
    const room = await deps.roomService.createOrGetWaitingRoom(String(ctx.chat.id), String(ctx.from.id));
    ctx.session.activeRoomId = room.id;
    await ctx.reply(t(ctx.session.locale, "roomCreated"));
  });

  bot.command("join", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private" || !ctx.from) return;
    const room = await deps.roomService.join(String(ctx.chat.id), String(ctx.from.id));
    if (!room) return void ctx.reply("No waiting room. Use /create.");
    ctx.session.activeRoomId = room.id;
    await ctx.reply(t(ctx.session.locale, "joinedRoom"));
  });

  bot.command("leave", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private" || !ctx.from) return;
    const room = await deps.roomService.leave(String(ctx.chat.id), String(ctx.from.id));
    if (!room) return void ctx.reply("No waiting room.");
    await ctx.reply(t(ctx.session.locale, "leftRoom"));
  });

  bot.command("begin", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return;
    const room = await deps.roomService.createOrGetWaitingRoom(String(ctx.chat.id), String(ctx.from!.id));
    const result = await deps.gameService.startGame(bot, room.id, String(ctx.chat.id));
    if (!result.ok) return void ctx.reply(t(ctx.session.locale, "notEnoughPlayers"));
    await ctx.reply(t(ctx.session.locale, "gameStarted"));
  });

  bot.command("warn", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private" || !ctx.from) return;
    const target = ctx.message?.reply_to_message?.from;
    if (!target) return void ctx.reply("Reply to a user to warn.");
    const count = await deps.warningService.warn(String(ctx.chat.id), String(target.id), "manual");
    await ctx.reply(t(ctx.session.locale, "warningGiven", { user: target.first_name, count }));
  });

  bot.command("unwarn", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return;
    const target = ctx.message?.reply_to_message?.from;
    if (!target) return void ctx.reply("Reply to a user to remove warning.");
    const count = await deps.warningService.unwarn(String(ctx.chat.id), String(target.id));
    await ctx.reply(t(ctx.session.locale, "warningsCount", { user: target.first_name, count }));
  });

  bot.command("warnings", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return;
    const target = ctx.message?.reply_to_message?.from ?? ctx.from;
    if (!target) return;
    const count = await deps.warningService.count(String(ctx.chat.id), String(target.id));
    await ctx.reply(t(ctx.session.locale, "warningsCount", { user: target.first_name, count }));
  });

  bot.command("vote", async (ctx) => {
    if (!ctx.from || ctx.chat?.type !== "private") return;
    const roomId = ctx.session.activeRoomId;
    if (!roomId) return void ctx.reply("No active game session.");
    const room = await deps.gameService.getRoomSnapshot(roomId);
    if (!room) return void ctx.reply("Room not found.");

    const keyboard = new InlineKeyboard();
    room.players
      .filter((p) => p.isAlive)
      .forEach((p) => keyboard.text(p.userId, `vote:${roomId}:${p.userId}`).row());

    await ctx.reply("Pick a target:", { reply_markup: keyboard });
  });

  bot.callbackQuery(/vote:(.+):(.+)/, async (ctx) => {
    if (!ctx.from) return;
    const [, roomId, targetId] = ctx.match;
    if (!roomId || !targetId) return;
    const result = await deps.gameService.submitVote(roomId, String(ctx.from.id), targetId);
    if (result === "already") {
      await ctx.answerCallbackQuery({ text: t(ctx.session.locale, "alreadyVoted"), show_alert: true });
      return;
    }
    await ctx.answerCallbackQuery({ text: t(ctx.session.locale, "voteRegistered") });
  });

  bot.on("chat_member", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return;
    const status = ctx.chatMember.new_chat_member.status;
    if (status !== "member") return;
    const settings = await deps.groupRepository.getSettings(String(ctx.chat.id));
    if (!settings?.welcomeEnabled) return;
    const name = ctx.chatMember.new_chat_member.user.first_name;
    const rules = settings.rulesText ? `\nRules: ${settings.rulesText}` : "";
    await ctx.reply(t(ctx.session.locale, "welcome", { user: name }) + rules);
  });

  bot.on("message:text", async (ctx, next) => {
    if (!ctx.chat || ctx.chat.type === "private" || !ctx.from) return next();

    const hasAdmin = await deps.moderationService.ensureBotAdmin(ctx);
    if (!hasAdmin) {
      await ctx.reply(t(ctx.session.locale, "adminRequired"));
      return;
    }

    const blocked = await deps.moderationService.handleAntiLink(ctx);
    if (blocked) {
      const count = await deps.moderationService.applyWarningPolicy(ctx, String(ctx.chat.id), String(ctx.from.id));
      await ctx.reply(t(ctx.session.locale, "warningGiven", { user: ctx.from.first_name, count }));
      await ctx.reply(t(ctx.session.locale, "linkBlocked"));
      return;
    }

    await next();
  });
}
