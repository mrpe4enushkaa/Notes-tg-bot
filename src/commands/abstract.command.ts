import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";
import RedisService from "../databases/redis/redis.service";

export default abstract class Command {
    constructor(protected bot: Bot, protected schema: Model<MongoSchema>, protected redis: RedisService) { }
    public abstract handle(): void;

    //databases commands
}