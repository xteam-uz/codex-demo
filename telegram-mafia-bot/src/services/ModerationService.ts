import type { BotContext } from "../types/bot.js";
import { WarningService } from "./WarningService.js";
import { GroupRepository } from "../repositories/GroupRepository.js";

const LINK_REGEX = /(https?:\/\/\S+|t\.me\/\S+|www\.\S+)/i;

export class ModerationService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly warningService: WarningService
  ) {}

  async ensureBotAdmin(ctx: BotContext): Promise<boolean> {
    if (ctx.chat?.type === "private") return true;
    const me = await ctx.api.getMe();
    const member = await ctx.api.getChatMember(ctx.chat!.id, me.id);
    if (member.status !== "administrator") return false;
    return Boolean(member.can_delete_messages && member.can_restrict_members);
  }

  async handleAntiLink(ctx: BotContext): Promise<boolean> {
    if (!ctx.chat || ctx.chat.type === "private" || !ctx.from || !ctx.message?.text) return false;
    const group = await this.groupRepository.getSettings(String(ctx.chat.id));
    if (!group?.antiLinkEnabled || !LINK_REGEX.test(ctx.message.text)) return false;

    const member = await ctx.api.getChatMember(ctx.chat.id, ctx.from.id);
    if (member.status === "administrator" || member.status === "creator") return false;

    await ctx.deleteMessage();
    return true;
  }

  async applyWarningPolicy(ctx: BotContext, groupId: string, userId: string): Promise<number> {
    const count = await this.warningService.warn(groupId, userId, "auto anti-link");
    const settings = await this.groupRepository.getSettings(groupId);
    if (!settings) return count;

    if (count >= settings.maxWarnings && settings.autoKickEnabled && ctx.chat) {
      await ctx.api.banChatMember(Number(groupId), Number(userId));
    } else if (count >= settings.maxWarnings && ctx.chat) {
      await ctx.api.restrictChatMember(Number(groupId), Number(userId), {
          can_send_messages: false,
          can_send_audios: false,
          can_send_documents: false,
          can_send_photos: false,
          can_send_videos: false,
          can_send_video_notes: false,
          can_send_voice_notes: false,
          can_send_polls: false,
          can_send_other_messages: false,
          can_add_web_page_previews: false,
          can_change_info: false,
          can_invite_users: false,
          can_pin_messages: false,
          can_manage_topics: false
      });
    }

    return count;
  }
}
