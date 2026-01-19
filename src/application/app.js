import express from "express";
import { publicRouter } from "../routes/publicRoute.js";
import { errorMiddleWare } from "../middleware/error-middleware.js";
import { userRouter } from "../routes/userRoute.js";
export const app = express()

app.use(express.json())
app.use(publicRouter)
app.use(userRouter)
app.use(errorMiddleWare)