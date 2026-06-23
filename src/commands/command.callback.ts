import Command from "./abstract.command";
import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";
import { promts } from "../utils/promts";
import { RedisStates } from "../models/redis.states.enum";

export default class CallbackCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.callbackQuery("cancel", async (ctx) => {
            if (ctx.chatId) {
                const lastMessageId = await this.getLastMessage(ctx.chatId);

                await this.bot.api.editMessageText(ctx.chatId, Number(lastMessageId!), promts.cancel.message, { parse_mode: "HTML" });
                await this.deleteState(ctx.chatId);
                await this.deleteLastMessage(ctx.chatId);
            }
        });

        this.bot.callbackQuery(/^delete_\d+$/, async (ctx) => {
            if (ctx.chatId) {
                const callbackData = ctx.callbackQuery.data;
                const index = Number(callbackData.replace("delete_", ""));

                const lastMessageId = await this.getLastMessage(ctx.chatId);
                const listOfNotes = await this.schema.find({ chatId: ctx.chatId });

                await this.deleteNote(ctx.chatId, listOfNotes[index - 1].text);

                await this.bot.api.editMessageText(ctx.chatId, Number(lastMessageId!), `${promts.delete.has}:\n${listOfNotes.map((note, index) => (`${index + 1}. ${note.text}\n`)).join("")}`, { parse_mode: "HTML" });
                await this.bot.api.sendMessage(ctx.chatId, promts.delete.deleted(index), { parse_mode: "HTML" });

                await this.deleteState(ctx.chatId);
                await this.deleteLastMessage(ctx.chatId);
            }
        });

        this.bot.callbackQuery("delete_all", async (ctx) => {
            if (ctx.chatId) {
                const lastMessageId = await this.getLastMessage(ctx.chatId);
                const listOfNotes = await this.schema.find({ chatId: ctx.chatId });

                await this.schema.deleteMany({ chatId: ctx.chatId });

                await this.bot.api.editMessageText(ctx.chatId, Number(lastMessageId!), `${promts.delete.has}:\n${listOfNotes.map((note, index) => (`${index + 1}. ${note.text}\n`)).join("")}`, { parse_mode: "HTML" });
                await this.bot.api.sendMessage(ctx.chatId, promts.delete.deletedAll, { parse_mode: "HTML" });

                await this.deleteState(ctx.chatId);
                await this.deleteLastMessage(ctx.chatId);
            }
        });

        this.bot.callbackQuery(/^edit_\d+$/, async (ctx) => {
            if (ctx.chatId) {
                const callbackData = ctx.callbackQuery.data;
                const index = Number(callbackData.replace("edit_", ""));
                const lastMessageId = await this.getLastMessage(ctx.chatId);

                await this.bot.api.editMessageText(ctx.chatId, Number(lastMessageId!), promts.edit.editing, { parse_mode: "HTML" });

                await this.setState(ctx.chatId, RedisStates.EDITING_2, this.time);
                await this.setNoteIndex(ctx.chatId, index);
            }
        });
    }
}