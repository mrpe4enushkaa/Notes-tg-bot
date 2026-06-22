import { InlineKeyboard } from "grammy";
import { promts } from "./promts";

export const cancelInlineKeyboard = new InlineKeyboard().text(promts.cancel.button, "cancel");