import type { ConversationFlavor } from "@grammyjs/conversations";
import type { SessionFlavor } from "grammy";
import type { Context } from "grammy";

export interface BotSession {
  locale: "en" | "uz";
  activeRoomId?: string;
  rateLimiter: {
    hits: number;
    windowStartedAt: number;
  };
}

export type BotContext = ConversationFlavor<Context & SessionFlavor<BotSession>>;

export type LocaleKey =
  | "start"
  | "adminRequired"
  | "welcome"
  | "linkBlocked"
  | "warningGiven"
  | "warningsCount"
  | "roomCreated"
  | "joinedRoom"
  | "leftRoom"
  | "gameStarted"
  | "notEnoughPlayers"
  | "alreadyVoted"
  | "voteRegistered";
