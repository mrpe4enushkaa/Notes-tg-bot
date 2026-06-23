import { Bot } from "grammy";
import Command from "./abstract.command";
import { promts } from "../utils/promts";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";
import { editInlineKeyboard } from "../utils/reply-markups";
import { RedisStates } from "../models/redis.states.enum";

export default class EditCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.command("edit", async (ctx) => {
            if (await this.isCommandWithState(ctx.chatId, ctx.msg.message_id)) return;

            const listOfNotes = await this.getNotes(ctx.chatId);

            listOfNotes[0]._id

            if (listOfNotes.length === 0) {
                await this.bot.api.sendMessage(ctx.chatId, promts.edit.empty, { parse_mode: "HTML" });
                return;
            }

            await this.bot.api.sendMessage(ctx.chatId, `${promts.edit.has}\n${listOfNotes.map((note, index) => (`${index + 1}. ${note.text}\n`)).join("")}`, {
                parse_mode: "HTML",
                reply_markup: editInlineKeyboard(listOfNotes)
            }).then(async (message) => await this.setLastMessage(ctx.chatId, message.message_id, this.time));

            await this.setState(ctx.chatId, RedisStates.EDITING_1, this.time);
        });
    }
}