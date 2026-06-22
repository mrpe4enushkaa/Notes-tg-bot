import Command from "./abstract.command";
import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";
import { promts } from "../utils/promts";

export default class CallbackCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.callbackQuery("cancel", async (ctx) => {
            if (ctx.chatId) {
                await this.deleteState(ctx.chatId);
                await this.bot.api.sendMessage(ctx.chatId, promts.cancel.message);
            }
        });
    }
}