import { Bot } from "grammy";

export default abstract class Command {
    constructor(protected bot: Bot) { }
    public abstract handle(): void;
}