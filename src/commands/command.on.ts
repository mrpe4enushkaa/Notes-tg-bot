import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import Command from "./abstract.command";
import { promts } from "../utils/promts";
import RedisService from "../databases/redis/redis.service";
import { RedisStates } from "../models/redis.states.enum";
import { deleteInlineKeyboard } from "../utils/reply-markups";

export default class OnCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.on("message:text", async (ctx) => {
            if (Number(await this.getState(ctx.chatId)) === RedisStates.CREATING) {
                const lastMessageId = await this.getLastMessage(ctx.chatId);

                if (ctx.msg.text.length > this.limitSymbols) {
                    await this.bot.api.deleteMessage(ctx.chatId, ctx.msg.message_id);

                    if (Number(await this.getLengthText(ctx.chatId)) !== ctx.msg.text.length) {
                        await this.bot.api.editMessageText(ctx.chatId, Number(lastMessageId!), promts.create.start(ctx.msg.text.length), { parse_mode: "HTML" });
                    }

                    await this.setLengthText(ctx.chatId, ctx.msg.text.length);
                    return;
                }

                await this.bot.api.editMessageText(ctx.chatId, Number(lastMessageId!), promts.create.start(), { parse_mode: "HTML" });
                await this.bot.api.sendMessage(ctx.chatId, promts.create.end, { parse_mode: "HTML" })

                await this.addNote(ctx.chatId, ctx.msg.text);
                await this.deleteState(ctx.chatId);
                await this.deleteLastMessage(ctx.chatId);
                await this.deleteLengthText(ctx.chatId);
            }

            if (Number(await this.getState(ctx.chatId)) === RedisStates.EDITING_2) {
                const index = await this.getNoteIndex(ctx.chatId);
                const listOfNotes = await this.getNotes(ctx.chatId);

                await this.bot.api.sendMessage(ctx.chatId, promts.edit.edited(Number(index), listOfNotes[Number(index) - 1].text), { parse_mode: "HTML" });

                await this.updateNote(listOfNotes[Number(index) - 1]._id!, ctx.chatId, ctx.message.text);
                await this.deleteLastMessage(ctx.chatId);
                await this.deleteState(ctx.chatId);
                await this.deleteNoteIndex(ctx.chatId);
            }
        });
    }
}