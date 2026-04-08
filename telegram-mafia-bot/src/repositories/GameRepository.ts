import { GamePhase, Role, RoomState, type PrismaClient } from "@prisma/client";

export class GameRepository {
  constructor(private readonly prisma: PrismaClient) {}

  createRoom(groupId: string, creatorId: string) {
    return this.prisma.room.create({ data: { groupId, creatorId, state: RoomState.waiting } });
  }

  findWaitingRoom(groupId: string) {
    return this.prisma.room.findFirst({ where: { groupId, state: RoomState.waiting } });
  }

  joinRoom(roomId: string, userId: string) {
    return this.prisma.roomPlayer.upsert({
      where: { roomId_userId: { roomId, userId } },
      update: {},
      create: { roomId, userId }
    });
  }

  leaveRoom(roomId: string, userId: string) {
    return this.prisma.roomPlayer.deleteMany({ where: { roomId, userId } });
  }

  async startRoom(roomId: string) {
    const players = await this.prisma.roomPlayer.findMany({ where: { roomId }, orderBy: { joinedAt: "asc" } });
    const roles = this.buildRoles(players.length);
    await this.prisma.$transaction([
      this.prisma.room.update({ where: { id: roomId }, data: { state: RoomState.started, phase: GamePhase.night, round: 1 } }),
      ...players.map((p, idx) =>
        this.prisma.roomPlayer.update({ where: { id: p.id }, data: { role: roles[idx] ?? Role.civilian, isAlive: true } })
      )
    ]);

    return this.prisma.roomPlayer.findMany({ where: { roomId } });
  }

  private buildRoles(playerCount: number): Role[] {
    const roles: Role[] = [Role.mafia, Role.doctor, Role.detective];
    while (roles.length < playerCount) roles.push(Role.civilian);
    return roles.sort(() => Math.random() - 0.5);
  }

  getAlivePlayers(roomId: string) {
    return this.prisma.roomPlayer.findMany({ where: { roomId, isAlive: true } });
  }

  setPhase(roomId: string, phase: GamePhase) {
    return this.prisma.room.update({ where: { id: roomId }, data: { phase } });
  }

  upsertVote(roomId: string, round: number, voterId: string, targetId: string) {
    return this.prisma.vote.upsert({
      where: { roomId_round_voterId: { roomId, round, voterId } },
      update: { targetId },
      create: { roomId, round, voterId, targetId }
    });
  }

  getVote(roomId: string, round: number, voterId: string) {
    return this.prisma.vote.findUnique({ where: { roomId_round_voterId: { roomId, round, voterId } } });
  }

  getRoomWithPlayers(roomId: string) {
    return this.prisma.room.findUnique({ where: { id: roomId }, include: { players: true, votes: true } });
  }
}
