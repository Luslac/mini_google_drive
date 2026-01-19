import { prisma } from "../application/database.js";

const find = async (where) => {
    return prisma.file.findFirst({
        where,
        select: {
            id: true,
            fileName: true,
            mimeType: true,
            size: true,
            path: true,
            createdAt: true
        }
    })
}

const fileUpload = async (data) => {
    return prisma.file.create({
        data,
        select: {
            id: true,
            fileName: true,
            mimeType: true,
            size: true,
            path: true,
            createdAt: true
        }
    })
}

const findMany = async (where) => {
    return prisma.file.findMany({
        where,
        select: {
            id: true,
            fileName: true,
            mimeType: true,
            size: true,
            createdAt: true
        }
    })
}

const findForDelete = async (where, select) => {
    return prisma.file.findMany({
        where,
        select
    })
}

export default {
    find, fileUpload, findMany, findForDelete
}