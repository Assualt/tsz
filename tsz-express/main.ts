import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import { Container } from 'inversify'
import { User } from './src/user/controller'
import { UserService } from './src/user/service'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaDB } from './src/db'
import { JwtTool } from './src/jwt'

const container = new Container()

/***
 * 依赖注入
 */
container.bind(User).to(User)
container.bind(UserService).to(UserService)
const server = new InversifyExpressServer(container)

/***
 * 封装prisma client
 */
container.bind<PrismaClient>("PrismaClient").toFactory(() => {
    return () => {
        return new PrismaClient
    }
})
container.bind(PrismaDB).to(PrismaDB)

/***
 * jwt
 */
container.bind(JwtTool).to(JwtTool)

/***
 * 添加中间件 如 app.use
 */
server.setConfig((app) => {
    app.use(express.json())
    app.use(container.get(JwtTool).init())
})

const app = server.build()

app.listen(3000, () => {
    console.log("app listen at 3000...")
})