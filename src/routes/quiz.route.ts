import { Router, Request, Response } from "express";
import { booleanQuestionValidations, choiceQuestionValidations } from "../validations/validations.js"
import { UserRequest, UserResponse } from "../types/types.js";
import quizModel, { IBooleanQuestion, IChoiceQuestion, QuestionType } from "../models/quiz.model.js";

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
        if (!Object.values(QuestionType).includes(questionData.type)) {
            throw new Error("Invalid question type must be 'boolean' or 'choice'")
        }

        const quiz = await quizModel.findById(quizId)

        if (quiz === null) {
            throw new Error("There are no quizzes with id " + quizId)
        }

        if (quiz.author.toString() !== userId) {
            throw new Error("You are not the author of this quiz")
        }

        let newQuestion: (IBooleanQuestion | IChoiceQuestion)

        switch (questionData.type) {
            case QuestionType.Boolean:
                await booleanQuestionValidations.validate(questionData)

                newQuestion = {
                    question: questionData.question,
                    correctAnswer: questionData.correctAnswer,
                    questionType: QuestionType.Boolean
                }

                quiz.questions.push(newQuestion)

                break
            case QuestionType.Choice:
                await choiceQuestionValidations.validate(questionData)

                newQuestion = {
                    question: questionData.question,
                    correctAnswer: questionData.correctAnswer,
                    options: questionData.options,
                    questionType: QuestionType.Choice
                }

                quiz.questions.push(newQuestion)
                break

        }

        await quiz.save()

        // TODO: Maybe don't return the whole quiz
        return response.status(200)
            .json(quiz)
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


        // TODO: Maybe don't return the whole quiz
        return response.status(200)
            .json({message: "Question deleted successfully"})
    } catch (error) {
        console.error(error)
        return response.status(400)
            .json({ error: true, message: error.message })
    }
})


export default quizRouter