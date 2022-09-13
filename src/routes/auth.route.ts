import { Router, Request, Response } from "express";
import userModel from "../models/user.model.js";
import { signupValidations, signinValidations } from "../validations/validations.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserResponse } from "src/types/types.js";

const authRouter = Router()

authRouter.post("/signup", async (request: Request, response: Response) => {
    const authData = request.body

    try {
        await signupValidations.validate(authData)

        const existCheck = await userModel.findOne({ email: authData.email })

        if (existCheck !== null) {
            throw new Error("There is already an account associated with this email")
        }

        const salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash(authData.password, salt)

        const newUser = new userModel({
            name: authData.name,
            email: authData.email,
            password: hashedPassword
        })

        await newUser.save()

        const userResponse: UserResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }

        const accessToken = jwt.sign(userResponse, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
        const refreshToken = jwt.sign(userResponse, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })

        return response.status(200)
            .json({
                user: userResponse,
                accessToken,
                refreshToken
            })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

authRouter.post("/signin", async (request: Request, response: Response) => {
    const authData = request.body

    try {
        await signinValidations.validate(authData)

        const user = await userModel.findOne({ email: authData.email })

        if (user === null) {
            throw new Error("There is no account associated with this email")
        }

        const passwordCheck = await bcrypt.compare(authData.password, user.password)

        if (!passwordCheck) {
            throw new Error("Your password is incorrect")
        }

        const userResponse: UserResponse = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        const accessToken = jwt.sign(userResponse, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
        const refreshToken = jwt.sign(userResponse, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })

        return response.status(200)
            .json({
                user: userResponse,
                accessToken,
                refreshToken
            })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

authRouter.post("/refreshToken", async (request: Request, response: Response) => {
    const refreshToken = request.body.refreshToken

    try {
        if (refreshToken === undefined || refreshToken === null) {
            throw new Error("refreshToken is a required property")
        }

        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as UserResponse

        const userResponse: UserResponse = {
            id: payload.id,
            name: payload.name,
            email: payload.email
        }

        const accessToken = jwt.sign(userResponse, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })

        return response.status(200)
            .json({
                user: userResponse,
                accessToken,
                refreshToken
            })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: "Invalid refresh token " + error.message })
    }
})

export default authRouter