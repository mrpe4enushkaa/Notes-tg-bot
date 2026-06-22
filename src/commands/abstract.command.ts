import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";
import { RedisStates } from "../models/redis.states.enum";

export default abstract class Command {
    protected time: number = 60 * 1;

    constructor(protected bot: Bot, protected schema: Model<MongoSchema>, protected redis: RedisService) { }

    public abstract handle(): void;

    //mongo
    protected async addNote(chatId: number, text: string): Promise<void> {
        await this.schema.create({ chatId, text });
    }

    protected async getNote(chatId: number): Promise<Array<string>> {
        return await this.schema.find({ chatId });
    }

    // protected async updateNote() { }

    protected async deleteNote(chatId: number, text: string): Promise<void> {
        await this.schema.deleteOne({ chatId, text });
    }

    //redis

    protected async setState(chatId: number, state: RedisStates, time?: number): Promise<void> {
        await this.redis.set(`waiting-state:${chatId}`, state, time);
    }

    protected async getState(chatId: number): Promise<string | null> {
        return await this.redis.get(`waiting-state:${chatId}`);
    }

    protected async deleteState(chatId: number): Promise<void> {
        await this.redis.delete(`waiting-state:${chatId}`);
    }

    protected async isState(chatId: number): Promise<boolean> {
        const result = await this.getState(chatId);
        return result ? true : false;
    }

    protected async isCommandWithState(chatId: number, messageId: number): Promise<boolean> {
        if (await this.isState(chatId)) {
            this.bot.api.deleteMessage(chatId, messageId);
            return true;
        }

        return false;
    }

    protected async setLastMessage(chatId: number, idMessage: number, time?: number): Promise<void> {
        await this.redis.set(`last-message:${chatId}`, idMessage, time);
    }

    protected async getLastMessage(chatId: number): Promise<string | null> {
        return await this.redis.get(`last-message:${chatId}`);
    }

    protected async deleteLastMessage(chatId: number): Promise<void> {
        await this.redis.delete(`last-message:${chatId}`);
    }
}