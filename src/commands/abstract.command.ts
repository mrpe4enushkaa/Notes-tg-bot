import { Bot } from "grammy";
import { Model, Types } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";
import { RedisStates } from "../models/redis.states.enum";

export default abstract class Command {
    protected time: number = 60 * 1;
    protected limitNotes: number = 10;
    protected limitSymbols: number = 200;

    constructor(protected bot: Bot, protected schema: Model<MongoSchema>, protected redis: RedisService) { }

    public abstract handle(): void;

    protected async addNote(chatId: number, text: string): Promise<void> {
        await this.schema.create({ chatId, text });
    }

    protected async getNotes(chatId: number): Promise<Array<MongoSchema>> {
        return await this.schema.find({ chatId });
    }

    protected async getLengthNotes(chatId: number): Promise<boolean> {
        return (await this.schema.find({ chatId })).length >= this.limitNotes;
    }

    protected async updateNote(_id: Types.ObjectId, chatId: number, text: string): Promise<void> {
        await this.schema.updateOne({ _id }, { $set: { chatId, text } });
    }

    protected async deleteNote(chatId: number, text: string): Promise<void> {
        await this.schema.deleteOne({ chatId, text });
    }

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

    protected async setLengthText(chatId: number, length: number, time?: number): Promise<void> {
        await this.redis.set(`length-text:${chatId}`, length, time);
    }

    protected async getLengthText(chatId: number): Promise<string | null> {
        return await this.redis.get(`length-text:${chatId}`);
    }

    protected async deleteLengthText(chatId: number): Promise<void> {
        await this.redis.delete(`length-text:${chatId}`);
    }

    protected async setNoteIndex(chatId: number, index: number, time?: number): Promise<void> {
        await this.redis.set(`note-index:${chatId}`, index, time);
    }

    protected async getNoteIndex(chatId: number): Promise<string | null> {
        return await this.redis.get(`note-index:${chatId}`);
    }

    protected async deleteNoteIndex(chatId: number): Promise<void> {
        await this.redis.delete(`note-index:${chatId}`);
    }
}