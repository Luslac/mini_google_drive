import { prisma } from "../application/database.js";

const create = async (data) => {
    return prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
        }})
}

const find = async (where) => {
    return prisma.user.findFirst({
        where,
        select: {
            id: true,
            name: true,
            email: true,
        }})
}


export default {
    create, find
}