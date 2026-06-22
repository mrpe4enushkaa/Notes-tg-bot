import { Bot } from "grammy";
import Command from "./abstract.command";
import { promts } from "../utils/promts";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";

export default class StartCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.command("start", async (ctx) => {
            await this.schema.deleteMany({ chatId: ctx.chatId });
            if (await this.isCommandWithState(ctx.chatId, ctx.msg.message_id)) return;
            await this.bot.api.sendMessage(ctx.chatId, promts.start, { parse_mode: "HTML" });
        });
    }
}