import { Bot } from "grammy";
import Command from "./abstract.command";
import { promts } from "../utils/promts";

export class StartCommand extends Command {
    constructor(bot: Bot) { super(bot); }

    public handle(): void {
        this.bot.command("start", async (ctx) => {
            await this.bot.api.sendMessage(ctx.chatId, promts.start, { parse_mode: "HTML" });
        });
    }
}