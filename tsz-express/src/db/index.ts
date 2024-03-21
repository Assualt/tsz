import { injectable, inject } from 'inversify'
import { PrismaClient } from '@prisma/client'

@injectable()
export class PrismaDB {
    client_:PrismaClient
    constructor(@inject('PrismaClient') PrismaClient: () => PrismaClient) {
        this.client_ = PrismaClient()
    }
}