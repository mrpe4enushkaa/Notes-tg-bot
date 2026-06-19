import { Bot } from "grammy";
import ConfigService from "./config/config.service";
import Command from "./commands/abstract.command";
import { StartCommand } from "./commands/command.start";

class TelegramBot {
    private bot: Bot;
    private commands: Array<Command> = [];

    constructor(private readonly token: string) {
        this.bot = new Bot(token);
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

        this.commands = commands.map(Command => new Command(this.bot));

        this.commands.forEach(command => {
            command.handle();
        });
    }

    public init(): void {
        this.listOfCommands();
        this.registerCommands();
        this.bot.start();
    }
}

const config = new ConfigService();

const bot = new TelegramBot(config.get("KEY_BOT"));

bot.init();