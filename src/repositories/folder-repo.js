import { prisma } from "../application/database.js"

const find = async (where) => {
    return prisma.folder.findFirst({
        where,
        select: {
            id: true,
            name: true,
            parentId: true,
            userId: true,
            createdAt: true
        }
    })
}

const create = async (data) => {
    return prisma.folder.create({
        data,
        select: {
            id: true,
            name: true,
            parentId: true,
            userId: true
        }
    })
}

const findMany = async (where) => {
    return prisma.folder.findMany({
        where,
        select: {
            id: true,
            name: true,
            createdAt: true
    }
    })
}

const deleteFolder = async (where) => {
    const folder = await find(where)
    await prisma.folder.delete({
        where
    })
    return folder
}
export default {
    find, create, findMany, deleteFolder
}