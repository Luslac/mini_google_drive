import { ResponseError } from "../utils/error-response.js";
import fileRepo from "../repositories/file-repo.js";
import fs from "fs"
const upload = async (req) => {
    const file = req.file
    const user = req.user
    if (!file) {
        throw new ResponseError(400, "File don't exist, Upload FIles!")
    }

    let folderId = req.body.folderId ? parseInt(req.body.folderId) : null
    const newFile = await fileRepo.fileUpload({
            fileName:           file.originalname,   
            fileSystemName:     file.filename,       
            mimeType:           file.mimetype,       
            size:               file.size,           
            path:               file.path,           
            userId:             user.id,             
            folderId:           folderId
    })
    return newFile
}

const getFileForDownload = async (req) => {
    const user = req.user 
    const file = await fileRepo.find({
        id: parseInt(req.params.id),
        userId: user.id
    })
    if (!file) {
        throw new ResponseError(404, "File not found");
    }

    if (!fs.existsSync(file.path)) {
        throw new ResponseError(500, "File physical data missing");
    }

    return {
        path: file.path,        
        filename: file.fileName,
        mimeType: file.mimeType 
    }

}

const deleteFile = async (req) => {
    const user = req.user
    const file = await fileRepo.find({
        id: parseInt(req.params.id),
        userId: user.id
    })
    if (!req.params.id) {
        throw new ResponseError(400, 'Bad Request')
    }

    if (!file) {
        throw new ResponseError(404, "File not found");
    }
    
    if (!fs.existsSync(file.path)) {
        throw new ResponseError(500, "File physical data missing");
    }

    return fileRepo.findForDelete(
        { id: file.id, userId: user.id },
        { 
        path: file.path,        
        filename: file.fileName,
        mimeType: file.mimeType }
    )

}

export default {
    upload, getFileForDownload, deleteFile
}