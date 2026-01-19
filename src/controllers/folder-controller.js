import folderServices from "../services/folder-services.js";

const create = async (req, res, next) => {
    try {
        const result = await folderServices.create(req)
        res.status(201).json({
            success: true,
            message: "Folder Created",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const find = async (req, res, next) => {
    try {
        const result = await folderServices.find(req)
        res.status(200).json({
            success: true,
            meessage: "File found",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const listContent = async (req, res, next) => {
    try {
        const result = await folderServices.listContent(req)
        res.status(200).json({
            success: true,
            message: "List File Of Folder",
            data: result.details,
            folders: result.folders,
            files: result.files
        })
    } catch (error) {
        next(error)
    }
}

const deleteFolder = async (req, res, next) => {
    try {
        const result = await folderServices.deleteFolder(req)
        res.status(200).json({
            data: result,
            message: "folder deleted",
            succes: true
        })
    } catch (error) {
        next(error)
    }
}
export default {
    create, find, listContent, deleteFolder
}