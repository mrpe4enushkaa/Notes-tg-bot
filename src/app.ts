import dotenv from "dotenv";
import { Bot } from "grammy";
import { promts } from "./utils/promts";
import { error } from "node:console";

dotenv.config();

const KEY_BOT = process.env.KEY_BOT;

if (!KEY_BOT) {
    throw error("Not added KEY_BOT\nLine:10");
}

const bot = new Bot(KEY_BOT);

bot.command("start", (ctx) => { ctx.reply(promts.start, { parse_mode: "HTML" }) });

bot.start();