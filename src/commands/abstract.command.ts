import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";
import { RedisStates } from "../models/redis.states.enum";

export default abstract class Command {
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
}