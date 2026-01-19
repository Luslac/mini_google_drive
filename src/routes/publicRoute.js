import { app } from "../application/app.js";
import userController from "../controllers/user-controller.js";
import express from "express"
const publicRouter = express.Router()

publicRouter.post('/users/register', userController.register)
publicRouter.post('/users/login', userController.login)

export {
    publicRouter
}