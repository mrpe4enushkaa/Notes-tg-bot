export default interface RedisOptions {
    connect(): void;
    set(key: string, state: string | number, time?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    delete(key: string): Promise<void>;
}