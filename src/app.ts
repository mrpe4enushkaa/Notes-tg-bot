import { Bot } from "grammy";
import ConfigService from "./config/config.service";
import Command from "./commands/abstract.command";
import { StartCommand } from "./commands/command.start";
import { Model } from "mongoose";
import MongoService from "./databases/mongo/mongo.service";
import MongoSchema from "./models/mongo.schema.interface";

class TelegramBot {
    private bot: Bot;
    private mongo: MongoService;
    private schema: Model<MongoSchema>;
    private commands: Array<Command> = [];

    constructor(
        private readonly token: string,
        private readonly urlMongo: string
    ) {
        this.bot = new Bot(token);
        this.mongo = new MongoService(urlMongo);

        this.schema = this.mongo.createSchema<MongoSchema>("Notes", {
            chatId: { type: Number, required: true },
            username: { type: String, required: true },
            text: { type: String, required: true }
        });
    }

    private listOfCommands(): void {
        this.bot.api.setMyCommands([
            { command: "/start", description: "👋 Начать работу" },
            { command: "/list", description: "📚 Список заметок" },
            { command: "/create", description: "📝 Создать заметку" },
            { command: "/edit", description: "✏️ Изменить заметку" },
            { command: "/delete", description: "🗑️ Удалить заметку" },
        ], { language_code: "ru" });
    }

    private registerCommands(): void {
        // const properties = [this.bot];
        const commands = [
            StartCommand,
            // ListCommand,
            // CreateCommand,
            // EditCommand,
            // DeleteCommand
        ];

        this.commands = commands.map(Command => new Command(this.bot, this.schema));

        this.commands.forEach(command => {
            command.handle();
        });
    }

    private async connectDatabases(): Promise<void> {
        await this.mongo.connect();
    }

    public async init(): Promise<void> {
        this.listOfCommands();
        this.registerCommands();
        await this.connectDatabases();
        await this.bot.start();
    }
}

const config = new ConfigService();

const bot = new TelegramBot(config.get("KEY_BOT"), config.get("MONGO_URL"));

bot.init().catch(console.error);