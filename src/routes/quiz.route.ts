import { Router, Request, Response } from "express";
import userModel from "../models/user.model.js";
import { signupValidations, signinValidations } from "../validations/validations.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserResponse } from "src/types/types.js";

const quizRouter = Router()


quizRouter.post("/add", async (request: Request, response: Response) => {
    
    try {




    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})