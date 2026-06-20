import mongoose from "mongoose";

export default interface MongoOptions {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    createSchema<T extends object>(name: string, definition: mongoose.SchemaDefinition<T>): mongoose.Model<T>;
}