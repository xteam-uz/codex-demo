import type { PrismaClient } from "@prisma/client";

export class WarningService {
  constructor(private readonly prisma: PrismaClient) {}

  async warn(groupId: string, userId: string, reason?: string) {
    await this.prisma.warning.create({ data: { groupId, userId, reason: reason ?? null } });
    return this.count(groupId, userId);
  }

  count(groupId: string, userId: string) {
    return this.prisma.warning.count({ where: { groupId, userId } });
  }

  async unwarn(groupId: string, userId: string) {
    const latest = await this.prisma.warning.findFirst({
      where: { groupId, userId },
      orderBy: { createdAt: "desc" }
    });
    if (!latest) return 0;
    await this.prisma.warning.delete({ where: { id: latest.id } });
    return this.count(groupId, userId);
  }
}
