import { Bot } from "grammy";
import Command from "./abstract.command";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";
import { RedisStates } from "../models/redis.states.enum";
import { promts } from "../utils/promts";

export default class CreateCommand extends Command {
    constructor(bot: Bot, schema: Model<MongoSchema>, redis: RedisService) { super(bot, schema, redis); }

    public handle(): void {
        this.bot.command("create", async (ctx) => {
            await this.setState(ctx.chatId, RedisStates.CREATING, this.time);
            await this.bot.api.sendMessage(ctx.chatId, promts.create.start, { parse_mode: "HTML" });
        });

        this.bot.on("message:text", async (ctx) => {
            if (await this.getState(ctx.chatId)) {
                await this.addNote(ctx.chatId, ctx.msg.text);
                await this.deleteState(ctx.chatId);
                await this.bot.api.sendMessage(ctx.chatId, promts.create.end, { parse_mode: "HTML" });
            }
        });
    }
}