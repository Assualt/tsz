
import { injectable } from "inversify";
import config from "./config";
import { Redis } from "ioredis";

@injectable()
export class RedisClient {
    client_ : Redis
    constructor() {
        this.client_ = new Redis(config.redisOptions)
    }
}