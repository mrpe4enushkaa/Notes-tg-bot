import { Bot } from "grammy";

export abstract class Command {
    constructor(protected bot: Bot) { }

    abstract handle(): void;
}