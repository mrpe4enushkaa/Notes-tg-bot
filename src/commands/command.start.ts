import { Bot } from "grammy";
import Command from "./abstract.command";
import { promts } from "../utils/promts";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";

export class StartCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>) { super(bot, schema); }

    public handle(): void {
        this.bot.command("start", async (ctx) => {
            console.log(this.schema);
            await this.bot.api.sendMessage(ctx.chatId, promts.start, { parse_mode: "HTML" });
        });
    }
}