import userServices from "../services/user-services.js";

const register = async (req, res, next) => {
    try {
        const result = await userServices.registration(req.body)
        res.status(201).json({
            success: true,
            message: "Account Created",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userServices.login(req.body)
        res.status(200).json({
            success: true,
            message: "Login Succesfull",
            data: result
        }) 
    } catch (error) {
        next(error)
    }
}

export default {
    register, login
}