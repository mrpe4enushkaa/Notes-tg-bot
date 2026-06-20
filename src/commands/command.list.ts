import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import Command from "./abstract.command";
import { promts } from "../utils/promts";

export default class ListCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>) { super(bot, schema); }

    public handle(): void {
        this.bot.command("list", async (ctx): Promise<void> => {
            const listOfNotes = await this.schema.find({ chatId: ctx.chatId, username: ctx.chat.username });
            console.log(listOfNotes);
            await this.bot.api.sendMessage(ctx.chatId, listOfNotes.length === 0 ? promts.list.empty : promts.list.has, { parse_mode: "HTML" });
        });
    }
}