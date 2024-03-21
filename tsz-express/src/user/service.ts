import { injectable, inject } from "inversify";
import { PrismaDB } from "../db";
import { UserDto } from "./user.dto";
import { User } from "@prisma/client";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { validate } from "class-validator";
import { ApiResult, StatusCode } from "../util/result";
import { JwtTool } from "../jwt";

@injectable()
export class UserService {
    constructor(@inject(PrismaDB) private readonly db: PrismaDB,
        @inject(JwtTool) private readonly jwt: JwtTool
    ) {
    }

    public async getUserByName(n: string) {
        const user: User | null = await this.db.client_.user.findFirst({
            where: { name: { equals: n } }
        });

        return ApiResult.format(StatusCode.SUCCESS, "Query OK", user)
    }

    public async getUserList() {
        let result = await this.db.client_.user.findMany();
        return ApiResult.format(StatusCode.SUCCESS, "OK", {
            totalCnt: result.length,
            detail: result
        })
    }

    public async createUser(user: UserDto) {
        let userDto = plainToClass(UserDto, user);
        let errors = await validate(userDto);
        if (errors.length) {
            return ApiResult.format(StatusCode.INVALID_ARGUMENTS, "invalid argument", errors)
        }

        try {
            let result = await this.db.client_.user.create({ data: user })
            return ApiResult.format(StatusCode.SUCCESS, "Add User OK", result.email)
        } catch (e) {
            console.log(e)
            return ApiResult.format(StatusCode.EXECUTE_FAIL, "add user fail", e)
        }
    }

    public async login(user: UserDto) {
        const one: User | null = await this.db.client_.user.findFirst({
            where: { name: { equals: user.name } }
        });

        if (one == null || one.password != user.password) {
            return ApiResult.format(StatusCode.LOGIN_FAIL, "login fail", null)
        }

        return ApiResult.format(StatusCode.SUCCESS, "login success", {
            token: this.jwt.createToken(one)
        });
    }
}