import { Types } from "mongoose";

export default interface MongoSchema {
    _id?: Types.ObjectId;
    chatId: number;
    text: string;
}