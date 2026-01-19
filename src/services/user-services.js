import userRepository from "../repositories/user-repo.js";
import { validate } from "../validation/validation.js";
import { registerUserValidation, loginUserValidation } from "../validation/user-validation.js";
import { checkExistingUser, getUserOrThrow, isPasswordValid} from "../utils/user-helper-function.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const registration = async (req) =>  {
    const user = await validate(registerUserValidation, req)
    await checkExistingUser(user)

    user.password = await bcrypt.hash(user.password, 10)
    return userRepository.create({
        email: user.email,
        password: user.password,
        name: user.name
    })
}

const login = async (req) => {
    const loginRequest = await validate(loginUserValidation, req)
    const user = await getUserOrThrow(loginRequest)
    await isPasswordValid(loginRequest.password, user.password)

    const token = jwt.sign(
            { 
                email: user.email,  
                role: "user"              
            }, 
            process.env.JWT_SECRET,       
            { expiresIn: process.env.JWT_EXPIRES_IN } 
        )
    return {
        token: token,
        email: user.email
    }
}

export default {
    registration, login
}