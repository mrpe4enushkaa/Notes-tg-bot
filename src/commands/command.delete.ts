import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import Command from "./abstract.command";
import { promts } from "../utils/promts";
import RedisService from "../databases/redis/redis.service";
import { RedisStates } from "../models/redis.states.enum";
import { deleteInlineKeyboard } from "../utils/reply-markups";

export default class DeleteCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.command("delete", async (ctx) => {
            if (await this.isCommandWithState(ctx.chatId, ctx.msg.message_id)) return;

            const listOfNotes = await this.schema.find({ chatId: ctx.chatId });

            if (listOfNotes.length === 0) {
                await this.bot.api.sendMessage(ctx.chatId, promts.delete.empty, { parse_mode: "HTML" });
                return;
            }

            await this.bot.api.sendMessage(ctx.chatId, `${promts.delete.has}:\n${listOfNotes.map((note, index) => (`${index + 1}. ${note.text}\n`)).join("")}`, {
                parse_mode: "HTML",
                reply_markup: deleteInlineKeyboard(listOfNotes)
            }).then(async (message) => await this.setLastMessage(ctx.chatId, message.message_id));

            await this.setState(ctx.chatId, RedisStates.DELETING, this.time);
        });
    }
}