import { Bot } from "grammy";
import Command from "./abstract.command";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";
import { RedisStates } from "../models/redis.states.enum";
import { promts } from "../utils/promts";
import { cancelInlineKeyboard } from "../utils/reply-markups";

export default class CreateCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.command("create", async (ctx) => {
            if (await this.isCommandWithState(ctx.chatId, ctx.msg.message_id)) return;

            if (await this.getLengthNotes(ctx.chatId)) {
                await this.bot.api.sendMessage(ctx.chatId, promts.length, { parse_mode: "HTML" });
                return;
            };

            await this.setState(ctx.chatId, RedisStates.CREATING, this.time);
            await this.bot.api.sendMessage(ctx.chatId, promts.create.start(), { parse_mode: "HTML", reply_markup: { ...cancelInlineKeyboard, remove_keyboard: true } })
                .then(async (message) => {
                    await this.setLastMessage(ctx.chatId, message.message_id, this.time);
                });;;
        });
    }
}