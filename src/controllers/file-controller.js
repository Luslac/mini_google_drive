import fileServices from "../services/file-services.js"
import fs from "fs"
const upload = async (req, res, next) => {
    try {
        const result = await fileServices.upload(req)
        res.status(201).json({
            success: true,
            message: "file upload success",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const download = async (req, res, next) => {
    try {
        const fileInfo = await fileServices.getFileForDownload(req)

        res.setHeader('Content-Type', fileInfo.mimeType)

        res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.filename}"`)

        const fileStream = fs.createReadStream(fileInfo.path)
        fileStream.pipe(res)
    } catch (error) {
        next(error)
    }
}

const deleteFile = async (req, res, next) => {
    try {
        const result = await fileServices.deleteFile(req)
        res.status(200).json({
            succes: true,
            message: "file deleted",
            data: result
        })
    } catch (error) {
        next(error)
    }
}
export default {
    upload, download, deleteFile
}