import mongoose, { Schema, SchemaDefinition, Model, model } from "mongoose";
import MongoOptions from "./mongo.interface";

export default class MongoService implements MongoOptions {
    constructor(private url: string) { }

    public async connect(): Promise<void> {
        console.log("Connecting to Mongo...");
        await mongoose.connect(this.url, { dbName: "notes-tg-bot-mongo" });
        console.log("Mongo has been connected");
    }

    public async disconnect(): Promise<void> {
        await mongoose.disconnect();
        console.log("Mongo has been disconnected");
    }

    public createSchema<T extends object>(name: string, definition: SchemaDefinition<T>): Model<T> {
        const schema: Schema<T> = new mongoose.Schema<T>(definition);
        return model<T>(name, schema);
    }
}