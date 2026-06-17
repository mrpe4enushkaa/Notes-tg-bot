import dotenv from "dotenv";
import { Bot } from "grammy";
import { promts } from "./utils/promts";

dotenv.config();

const bot = new Bot(process.env.BOT_KEY!);

bot.command("start", (ctx) => { ctx.reply(promts.start, { parse_mode: "HTML" }) });

bot.start();

