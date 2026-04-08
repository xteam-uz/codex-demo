import type { PrismaClient } from "@prisma/client";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  upsertUser(id: string, firstName: string, username?: string) {
    const safeUsername = username ?? null;
    return this.prisma.user.upsert({
      where: { id },
      update: { firstName, username: safeUsername },
      create: { id, firstName, username: safeUsername }
    });
  }
}
