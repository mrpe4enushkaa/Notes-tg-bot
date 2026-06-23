import { InlineKeyboard } from "grammy";
import { promts } from "./promts";
import MongoSchema from "../models/mongo.schema.interface";

export const cancelInlineKeyboard = new InlineKeyboard().text(promts.cancel.button, "cancel");

export const deleteInlineKeyboard = (listOfNotes: Array<MongoSchema>) => {
    const keyboard = new InlineKeyboard();

    listOfNotes.map((_, index) => {
        keyboard.text(`${index + 1}`, `delete_${index + 1}`);

        if ((index + 1) % 5 === 0) {
            keyboard.row();
        }
    });

    if (listOfNotes.length > 1) {
        keyboard
            .row()
            .text(promts.delete.all, "delete_all");
    }

    keyboard
        .row()
        .text(promts.cancel.button, "cancel");

    return keyboard;
}

export const editInlineKeyboard = (listOfNotes: Array<MongoSchema>) => {
    const keyboard = new InlineKeyboard();

    listOfNotes.map((_, index) => {
        keyboard.text(`${index + 1}`, `edit_${index + 1}`);

        if ((index + 1) % 5 === 0) {
            keyboard.row();
        }
    });

    keyboard
        .row()
        .text(promts.cancel.button, "cancel");

    return keyboard;
}