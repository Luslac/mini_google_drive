import folderRepo from "../repositories/folder-repo.js"
import fileRepo from "../repositories/file-repo.js"
import { ResponseError } from "../utils/error-response.js"
import { validateIdUserAndParentFolderId, IsUserOwnTheFolder, getAllFilePathsRecursive} from "../utils/folder-helper-function.js"
import fs from "fs"

const create = async (req) => {
    const user = req.user
    const folderInfo = req.body
    if (!folderInfo.name) {
        throw new ResponseError(400, 'Name Must Be Fill')
    }
    let parentId = folderInfo.parentId ? parseInt(folderInfo.parentId) : null

    if (parentId !== null) {
        await validateIdUserAndParentFolderId(user.id, parentId)
    }
    return folderRepo.create({
            name: folderInfo.name,
            parentId: folderInfo.parentId,
            userId : user.id
    })
}

const find = async (req) => {
    const user = req.user
    const folderID = parseInt(req.params.id)

    await IsUserOwnTheFolder(user.id, folderID)
    return folderRepo.find({
            id: folderID
    })
}

const listContent = async (req) => {
    const user = req.user
    
    let folderId = req.params.id ? parseInt(req.params.id) : null

    let currentFolderInfo = null
    if (folderId !== null) {
        currentFolderInfo = await validateIdUserAndParentFolderId(user.id, folderId)
    }
    const childFolder = await folderRepo.findMany({
        userId: user.id,
        parentId: folderId
    })

    const files = await fileRepo.findMany({
        userId: user.id,
        folderId: folderId
    })

    return {
        details: currentFolderInfo,
        folders: childFolder,
        files: files
    }
}

const deleteFolder = async (req) => {
    const user = req.user
    let folderId = req.params.id ? parseInt(req.params.id) : null

    if (folderId !== null) {
        await validateIdUserAndParentFolderId(user.id, folderId)
    }

    const allPathsToDelete = await getAllFilePathsRecursive(folderId, user.id)


    for (const path of allPathsToDelete) {
        try {
            await fs.unlink(path);
        } catch (e) { /* ignore error */ }
    }

    
    return folderRepo.deleteFolder(
        { id: folderId }
    )
}
export default {
    create, find, listContent, deleteFolder,
}