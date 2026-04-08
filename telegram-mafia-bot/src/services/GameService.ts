import { GamePhase, Role, RoomState } from "@prisma/client";
import type { Bot } from "grammy";
import { GameRepository } from "../repositories/GameRepository.js";
import type { BotContext } from "../types/bot.js";

export class GameService {
  private readonly timers = new Map<string, NodeJS.Timeout>();

  constructor(private readonly gameRepository: GameRepository) {}

  async startGame(bot: Bot<BotContext>, roomId: string, groupId: string): Promise<{ ok: boolean; reason?: string }> {
    const room = await this.gameRepository.getRoomWithPlayers(roomId);
    if (!room || room.players.length < 4) return { ok: false, reason: "notEnoughPlayers" };

    const players = await this.gameRepository.startRoom(roomId);
    await Promise.all(
      players.map((player) =>
        bot.api.sendMessage(Number(player.userId), `Your role: ${player.role?.toUpperCase() ?? Role.civilian.toUpperCase()}`)
      )
    );

    await bot.api.sendMessage(Number(groupId), "Night phase started. Mafia, Doctor, Detective act in private chat.");
    this.schedulePhaseTransition(bot, roomId, groupId, GamePhase.day, 60_000);
    return { ok: true };
  }

  async getRoomSnapshot(roomId: string) {
    return this.gameRepository.getRoomWithPlayers(roomId);
  }

  async submitVote(roomId: string, voterId: string, targetId: string): Promise<"already" | "ok"> {
    const room = await this.gameRepository.getRoomWithPlayers(roomId);
    if (!room || room.state !== RoomState.started) throw new Error("Room not active");
    const existing = await this.gameRepository.getVote(roomId, room.round, voterId);
    if (existing) return "already";
    await this.gameRepository.upsertVote(roomId, room.round, voterId, targetId);
    return "ok";
  }

  async resolveRound(bot: Bot<BotContext>, roomId: string, groupId: string): Promise<void> {
    const room = await this.gameRepository.getRoomWithPlayers(roomId);
    if (!room) return;

    const alive = room.players.filter((p) => p.isAlive);
    const mafiaAlive = alive.filter((p) => p.role === Role.mafia).length;
    const civiliansAlive = alive.length - mafiaAlive;

    if (mafiaAlive === 0) {
      await bot.api.sendMessage(Number(groupId), "Civilians win! All mafia were eliminated.");
      await this.gameRepository.setPhase(roomId, GamePhase.finished);
      return;
    }

    if (mafiaAlive >= civiliansAlive) {
      await bot.api.sendMessage(Number(groupId), "Mafia wins! They reached parity.");
      await this.gameRepository.setPhase(roomId, GamePhase.finished);
      return;
    }

    await bot.api.sendMessage(Number(groupId), "Next night begins.");
    await this.gameRepository.setPhase(roomId, GamePhase.night);
    this.schedulePhaseTransition(bot, roomId, groupId, GamePhase.day, 60_000);
  }

  private schedulePhaseTransition(
    bot: Bot<BotContext>,
    roomId: string,
    groupId: string,
    nextPhase: GamePhase,
    delayMs: number
  ): void {
    const old = this.timers.get(roomId);
    if (old) clearTimeout(old);
    const timer = setTimeout(async () => {
      await this.gameRepository.setPhase(roomId, nextPhase);
      await bot.api.sendMessage(Number(groupId), `Phase changed to ${nextPhase}.`);
      if (nextPhase === GamePhase.day) {
        await this.gameRepository.setPhase(roomId, GamePhase.voting);
        await bot.api.sendMessage(Number(groupId), "Voting started. Use /vote in private chat.");
        this.schedulePhaseTransition(bot, roomId, groupId, GamePhase.result, 45_000);
      } else if (nextPhase === GamePhase.result) {
        await this.resolveRound(bot, roomId, groupId);
      }
    }, delayMs);
    this.timers.set(roomId, timer);
  }
}
