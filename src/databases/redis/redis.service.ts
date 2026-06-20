import Redis from "ioredis";
import RedisOptions from "./redis.interface";

export default class RedisService implements RedisOptions {
    private client!: Redis;

    constructor(private host: string, private port: number) { }

    public connect(): void {
        console.log("Connecting to Redis...");

        this.client = new Redis({
            host: this.host,
            port: this.port
        })

        this.client.on("connect", () => { console.log("Redis has been connected") });
        this.client.on("error", (error) => { throw new Error(String(error)) });
    }

    public async set(key: string, state: string | number, time?: number): Promise<void> {
        if (time) {
            await this.client.set(key, state, "EX", time);
        } else {
            await this.client.set(key, state);
        }
    }

    public async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    public async delete(key: string): Promise<void> {
        await this.client.del(key);
    }
}