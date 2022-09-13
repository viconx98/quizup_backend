import { Schema, model, connect, Types } from 'mongoose';

interface IQuestion {
    question: string
}


interface IBooleanQuestion {
    question: string,
    correctAnswer: boolean,
    options: boolean[]
}

interface IChoiceQuestion {
    question: string,
    correctAnswer: string,
    options: string[]
}

interface IQuiz {
    author: Schema.Types.ObjectId,
    questions: IQuestion[],
    timePerQuestion: number
}

const questionSchema = new Schema<IQuestion>({
    question: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const booleanQuestionSchema = questionSchema.discriminator("BooleanQuestion", {
    correctAnswer: {
        type: Boolean,
        required: true
    },
    options: {
        type: [Boolean],
        required: true,
        default: [true, false]
    }
})

export const choiceQuestionSchema = questionSchema.discriminator("ChoiceQuestion", {
    correctAnswer: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
    }
})

const quizSchema = new Schema<IQuiz>({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    questions: {
        type: [questionSchema],
        default: []
    }
})

export default model("Quiz", quizSchema)