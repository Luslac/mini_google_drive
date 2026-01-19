import multer from "multer";
import path from "path"
import fs from "fs"
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueiID = Date.now() + "-" + Math.random()
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + uniqueiID + ext)
    }
})

const fileFilter = (req, file, cb) => {
    cb(null, true);
}

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 
    },
    fileFilter: fileFilter
})