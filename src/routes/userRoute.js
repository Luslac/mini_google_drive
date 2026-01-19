import express from "express"
import { upload } from "../utils/multer.js"
import userController from "../controllers/user-controller.js"
import { authMiddleware } from "../middleware/auth-middleware.js"
import fileController from "../controllers/file-controller.js"
import folderController from "../controllers/folder-controller.js"
import userRepo from "../repositories/user-repo.js"

export const userRouter = express.Router()
userRouter.use(authMiddleware)
// Files
userRouter.post('/users/files/upload', upload.single("file"), fileController.upload)
userRouter.get('/users/files/:id/download', fileController.download)
userRouter.delete('/users/files/:id', fileController.deleteFile)
// Folder
userRouter.post('/users/folders/create', folderController.create)
userRouter.get('/users/folders/:id', folderController.find) // Satu Folder
userRouter.get('/users/folders/:id/file-list', folderController.listContent) // List File dalam Folder
userRouter.delete('/users/folders/:id', folderController.deleteFolder)