import { controller, httpGet as GetMapping, httpPost as PostMapping, queryParam as QueryParam } from "inversify-express-utils";
import { Request, Response } from 'express'
import { UserService } from "./service";
import { inject } from "inversify";
import { JwtTool } from "../jwt";

@controller("/user")
export class User {

    constructor(@inject(UserService) private readonly userService: UserService) {
    }

    @GetMapping("/index")
    public async getIndex(@QueryParam("name") name: string) {
        return await this.userService.getUserByName(name)
    }

    @GetMapping("/listall", JwtTool.middleware())
    public async getAll(req: Request, resp: Response) {
        console.log(req.rawHeaders)
        return await this.userService.getUserList();
    }

    @PostMapping("/create")
    public async createUser(req: Request, resp: Response) {
        return await this.userService.createUser(req.body)
    }

    @PostMapping("/login")
    public async login(req: Request) {
        return await this.userService.login(req.body)
    }
}