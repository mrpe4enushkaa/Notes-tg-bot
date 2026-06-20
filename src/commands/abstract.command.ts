import { Bot } from "grammy";
import { Model } from "mongoose";
import MongoSchema from "../models/mongo.schema.interface";

export default abstract class Command {
    constructor(protected bot: Bot, protected schema: Model<MongoSchema>) { }
    public abstract handle(): void;
}