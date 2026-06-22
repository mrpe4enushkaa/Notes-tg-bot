import { Bot, InlineKeyboard } from "grammy";
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
            await this.setState(ctx.chatId, RedisStates.CREATING, this.time);
            await this.bot.api.sendMessage(ctx.chatId, promts.create.start, { parse_mode: "HTML", reply_markup: { ...cancelInlineKeyboard, remove_keyboard: true } })
                .then(async (message) => {
                    await this.setLastMessage(ctx.chatId, message.message_id);
                });;;
        });

        this.bot.on("message:text", async (ctx) => {
            if (await this.isState(ctx.chatId)) {
                const lastMessageId = await this.getLastMessage(ctx.chatId);
                await this.bot.api.editMessageText(ctx.chatId, Number(lastMessageId!), promts.create.start);
                await this.bot.api.sendMessage(ctx.chatId, promts.create.end, { parse_mode: "HTML" })

                await this.addNote(ctx.chatId, ctx.msg.text);
                await this.deleteState(ctx.chatId);
                await this.deleteLastMessage(ctx.chatId);
            }
        });
    }
}