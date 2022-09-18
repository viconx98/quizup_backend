import { Router, Request, Response } from "express";
import { questionValidation } from "../validations/validations.js"
import { UserRequest, UserResponse } from "../types/types.js";
import quizModel, { IQuestion, QuestionType } from "../models/quiz.model.js";
import { Schema, model, connect, Types } from 'mongoose';
import mongoose from "mongoose";
import uploadMiddleware from "../multer.js"

const quizRouter = Router()



quizRouter.get("/me", async (request: UserRequest, response: Response) => {
    try {
        const quizzes = await quizModel.find({ author: request.user.id })

        return response.status(200)
            .json(quizzes)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

quizRouter.get("/:quizId", async (request: UserRequest, response: Response) => {

    try {
        const quiz = await quizModel.findById(request.params.quizId)

        if (quiz === null) {
            throw new Error("There are no quiz with the id " + request.params.quizId)
        }

        return response.status(200)
            .json(quiz)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

quizRouter.post("/add", async (request: UserRequest, response: Response) => {
    const userId = request.user.id
    const title = request.body.title

    try {
        if (title === undefined || title === null || title === "") {
            throw new Error("title is a required field")
        }

        const newQuiz = new quizModel({
            author: userId,
            title: title
        })

        await newQuiz.save()

        return response.status(200)
            .json(newQuiz)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

quizRouter.post("/delete", async (request: UserRequest, response: Response) => {
    const userId = request.user.id
    const quizId = request.body.quizId

    try {
        const quiz = await quizModel.findById(quizId)

        if (quiz === null) {
            throw new Error("There are no quizzes with id " + quizId)
        }

        if (quiz.author.toString() !== userId) {
            throw new Error("You are not the author of this quiz")
        }

        await quizModel.findByIdAndDelete(quiz)

        return response.status(200)
            .json({ message: "Quiz deleted successfully" })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

quizRouter.post("/question/add", async (request: UserRequest, response: Response) => {
    const userId = request.user.id
    const quizId = request.body.quizId
    const questionData = request.body.questionData

    try {
        if (!Object.values(QuestionType).includes(questionData.questionType)) {
            throw new Error("Invalid question type must be 'boolean' or 'choice'")
        }

        const quiz = await quizModel.findById(quizId)

        if (quiz === null) {
            throw new Error("There are no quizzes with id " + quizId)
        }

        if (quiz.author.toString() !== userId) {
            throw new Error("You are not the author of this quiz")
        }

        await questionValidation.validate(questionData)

        let id = new mongoose.Types.ObjectId()
        let newQuestion: IQuestion = {
            _id: id,
            question: questionData.question,
            correctAnswer: questionData.correctAnswer,
            options: questionData.options.map(opt => opt.toString()),
            questionType: questionData.questionType,
        }

        quiz.questions.push(newQuestion)

        await quiz.save()

        return response.status(200)
            .json(newQuestion)
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})

quizRouter.post("/question/uploadImage", uploadMiddleware.single("image"), async (request: UserRequest, response: Response) => {
    try {
        const url = "http://localhost:3001/" + "images/" + request.file?.filename

        return response.status(200)
            .send({
                fileUrl: url
            })
        
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    } 

})

quizRouter.post("/question/delete", async (request: UserRequest, response: Response) => {
    const userId = request.user.id
    const quizId = request.body.quizId
    const questionId = request.body.questionId

    try {
        const quiz = await quizModel.findById(quizId)

        if (quiz === null) {
            throw new Error("There are no quizzes with id " + quizId)
        }

        if (quiz.author.toString() !== userId) {
            throw new Error("You are not the author of this quiz")
        }

        await quizModel.updateOne({ _id: quizId }, {
            $pull: {
                questions: { _id: questionId }
            }
        })


        return response.status(200)
            .json({ message: "Question deleted successfully" })
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})


export default quizRouter