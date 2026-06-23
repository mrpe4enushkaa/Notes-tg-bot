import { Bot } from "grammy";
import ConfigService from "./config/config.service";
import Command from "./commands/abstract.command";
import StartCommand from "./commands/command.start";
import { Model } from "mongoose";
import MongoService from "./databases/mongo/mongo.service";
import MongoSchema from "./models/mongo.schema.interface";
import ListCommand from "./commands/command.list";
import RedisService from "./databases/redis/redis.service";
import CreateCommand from "./commands/command.create";
import DeleteCommand from "./commands/command.delete";
import CallbackCommand from "./commands/command.callback";

class TelegramBot {
    private bot: Bot;
    private mongo: MongoService;
    private schema: Model<MongoSchema>;
    private redis: RedisService;
    private commands: Array<Command> = [];

    constructor(
        private readonly token: string,
        private readonly urlMongo: string,
        private readonly hostRedis: string,
        private readonly portRedis: number
    ) {
        this.bot = new Bot(token);
        this.mongo = new MongoService(urlMongo);
        this.redis = new RedisService(hostRedis, portRedis);

        this.schema = this.mongo.createSchema<MongoSchema>("Notes", {
            chatId: { type: Number, required: true },
            text: { type: String, required: true }
        });
    }

    private listOfCommands(): void {
        this.bot.api.setMyCommands([
            { command: "start", description: "👋 Начать работу" },
            { command: "list", description: "📚 Список заметок" },
            { command: "create", description: "📝 Создать заметку" },
            { command: "edit", description: "✏️ Изменить заметку" },
            { command: "delete", description: "🗑️ Удалить заметку" },
        ], { language_code: "ru" });
    }

    private registerCommands(): void {
        const commands = [
            StartCommand,
            ListCommand,
            DeleteCommand,
            CreateCommand,
            // EditCommand,
            CallbackCommand
        ];

        this.commands = commands.map(Command => new Command(this.bot, this.schema, this.redis));

        this.commands.forEach(command => {
            command.handle();
        });
    }

    private async connectDatabases(): Promise<void> {
        await this.mongo.connect();
        this.redis.connect();
    }

    public async init(): Promise<void> {
        this.listOfCommands();
        this.registerCommands();
        await this.connectDatabases();
        await this.bot.start();
    }
}

const config = new ConfigService();

const bot = new TelegramBot(
    config.get("KEY_BOT"),
    config.get("MONGO_URL"),
    config.get("REDIS_HOST"),
    Number(config.get("REDIS_PORT"))
);


bot.init().catch(console.error);