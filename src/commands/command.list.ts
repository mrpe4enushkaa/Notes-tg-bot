import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import Command from "./abstract.command";
import { promts } from "../utils/promts";
import RedisService from "../databases/redis/redis.service";

export default class ListCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.command("list", async (ctx) => {
            const listOfNotes = await this.schema.find({ chatId: ctx.chatId });
            console.log(listOfNotes)
            await this.bot.api.sendMessage(ctx.chatId,
                listOfNotes.length === 0 ?
                    promts.list.empty :
                    `${promts.list.has}\n${listOfNotes.map((note, index) => `${index + 1}. ${note.text}\n`).join("")}`,
                { parse_mode: "HTML" });
        });
    }
}