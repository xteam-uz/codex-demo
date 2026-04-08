import { GameRepository } from "../repositories/GameRepository.js";

export class RoomService {
  constructor(private readonly gameRepository: GameRepository) {}

  async createOrGetWaitingRoom(groupId: string, creatorId: string) {
    const existing = await this.gameRepository.findWaitingRoom(groupId);
    if (existing) return existing;
    return this.gameRepository.createRoom(groupId, creatorId);
  }

  async join(groupId: string, userId: string) {
    const room = await this.gameRepository.findWaitingRoom(groupId);
    if (!room) return null;
    await this.gameRepository.joinRoom(room.id, userId);
    return room;
  }

  async leave(groupId: string, userId: string) {
    const room = await this.gameRepository.findWaitingRoom(groupId);
    if (!room) return null;
    await this.gameRepository.leaveRoom(room.id, userId);
    return room;
  }
}
