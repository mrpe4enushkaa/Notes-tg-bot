import { Bot } from "grammy";
import ConfigService from "./config/config.service";

class BotApp {
    private bot: Bot;

    constructor(private readonly token: string) {
        this.bot = new Bot(token);
    }

    public init(): void {
        this.bot.start();
    }
}

const config = new ConfigService();

const bot = new BotApp(config.get("KEY_BOT"));

bot.init();