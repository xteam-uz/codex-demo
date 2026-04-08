import type { PrismaClient } from "@prisma/client";

export class GroupRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsertGroup(groupId: string, title: string) {
    return this.prisma.group.upsert({
      where: { id: groupId },
      update: { title },
      create: {
        id: groupId,
        title,
        settings: { create: {} }
      },
      include: { settings: true }
    });
  }

  getSettings(groupId: string) {
    return this.prisma.groupSetting.findUnique({ where: { groupId } });
  }
}
