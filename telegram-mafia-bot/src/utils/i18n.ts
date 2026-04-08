import type { LocaleKey } from "../types/bot.js";

const dictionary: Record<"en" | "uz", Record<LocaleKey, string>> = {
  en: {
    start: "Welcome. I can run Mafia games and group moderation.",
    adminRequired: "I need admin rights (delete + restrict members) to fully work.",
    welcome: "Welcome, {user}!",
    linkBlocked: "Links are blocked in this group.",
    warningGiven: "Warning issued to {user}. Total: {count}",
    warningsCount: "Warnings for {user}: {count}",
    roomCreated: "Room created. Players can now /join.",
    joinedRoom: "You joined the room.",
    leftRoom: "You left the room.",
    gameStarted: "Game started. Check your private chat for your role.",
    notEnoughPlayers: "At least 4 players are required.",
    alreadyVoted: "You already voted this round.",
    voteRegistered: "Your vote was registered."
  },
  uz: {
    start: "Xush kelibsiz. Men Mafia o'yini va guruh moderatsiyasini boshqaraman.",
    adminRequired: "To'liq ishlash uchun menga admin huquqlari kerak (delete + restrict).",
    welcome: "Xush kelibsiz, {user}!",
    linkBlocked: "Bu guruhda havolalar taqiqlangan.",
    warningGiven: "{user} ga ogohlantirish berildi. Jami: {count}",
    warningsCount: "{user} uchun ogohlantirishlar: {count}",
    roomCreated: "Xona yaratildi. Endi o'yinchilar /join qilishi mumkin.",
    joinedRoom: "Siz xonaga qo'shildingiz.",
    leftRoom: "Siz xonadan chiqdingiz.",
    gameStarted: "O'yin boshlandi. Rolingiz private chatga yuborildi.",
    notEnoughPlayers: "Kamida 4 ta o'yinchi kerak.",
    alreadyVoted: "Siz bu raundda allaqachon ovoz bergansiz.",
    voteRegistered: "Ovozingiz qabul qilindi."
  }
};

export function t(locale: "en" | "uz", key: LocaleKey, params?: Record<string, string | number>): string {
  const template = dictionary[locale][key];
  if (!params) return template;
  return Object.entries(params).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), template);
}
