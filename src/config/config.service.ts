import { config, DotenvParseOutput } from "dotenv";
import ConfigOptions from "./config.interface";

export default class ConfigService implements ConfigOptions {
    private config: DotenvParseOutput;

    constructor() {
        const { error, parsed } = config();

        if (error) { throw new Error(`File ".env" not found`); }
        if (!parsed) { throw new Error(`File ".env" is empty`); }

        this.config = parsed;
    }

    public get(key: string): string {
        const data = this.config[key];

        if (!data) { throw new Error(`Invalid type for key: ${key}`); }

        return data;
    }
}
