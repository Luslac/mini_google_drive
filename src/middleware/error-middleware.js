import { ZodError } from "zod"
import { ResponseError } from "../utils/error-response.js"
import { logger } from "../application/logging.js"

const errorMiddleWare = async (err, req, res, next) => {
    if (!err) {
        next()
        return
    }
    if (err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message,
            success: false
        }).end()
    } else if (err instanceof ZodError) {
        res.status(400).json({
            errors: "Validation Error",
            details: err.flatten().fieldErrors
        }).end()
    } else {
        logger.error('Internal Server Error', { 
        error: err.message, 
        stack: err.stack,
        path: req.path 
        })
        res.status(500).json({
            errors: err.message,
            success: false
        }).end()
    }
}

export {
    errorMiddleWare
}