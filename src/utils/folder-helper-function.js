import fileRepo from "../repositories/file-repo.js"
import folderRepo from "../repositories/folder-repo.js" 
import { ResponseError } from "./error-response.js"

export const validateIdUserAndParentFolderId = async (userID,  parentId) => {
    const folder = await folderRepo.find({id: parentId})

    if (!folder) {
        throw new ResponseError(404, 'Folder Not Found!')
    }
    if (folder.userId !== userID) {
        throw new ResponseError(403, 'Forbidden Request!')
    }

    return folder
} 

export const IsUserOwnTheFolder = async (userID, folderId) => {
    const folder = await folderRepo.find({id: folderId})

    if (!folder) {
        throw new ResponseError(404, 'Folder Not Found!')
    }
    if (folder.userId !== userID) {
        throw new ResponseError(403, 'Forbidden Request!')
    }

    return folder
}

export const getAllFilePathsRecursive = async (folderId, userId) => {
    let paths = []

    const files = await fileRepo.findForDelete(
        {
            folderId: folderId,
            userId: userId
        },
        {path: true}
    )

    files.forEach(f => paths.push(f.path))


    const subFolders = await folderRepo.findMany(
        {
            parentId: folderId,
            userId: userId
        }
    )

    for (const sub of subFolders) {
        const childPaths = await getAllFilePathsRecursive(sub.id, userId)
        paths = [...paths, ...childPaths]
    }

    return paths
}