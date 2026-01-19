import {PrismaClient} from "@prisma/client"
import {logger} from "./logging.js"
export const prisma = new PrismaClient({
    log: [
    {
        emit: 'event',
        level: 'query',
    },
    {
        emit: 'event',
        level: 'error',
    },
    {
        emit: 'event',
        level: 'info',
    },
    {
        emit: 'event',
        level: 'warn',
    },
],
})

prisma.$on("error", (e) => {
    logger.error(e)
})

prisma.$on("warn", (e) => {
    logger.warn(e)
})

prisma.$on("info", (i) => {
    logger.info(i)
})

prisma.$on("query", (q) => {
    logger.info(q)
})