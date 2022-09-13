import { Schema, model, connect, Types } from 'mongoose';

// TODO: Images for questions
export enum QuestionType {
    Boolean = "boolean",
    Choice = "choice"
}

interface IQuestion {
    question: string,
    correctAnswer: any,
    questionType: QuestionType.Boolean | QuestionType.Choice
}

export interface IBooleanQuestion extends IQuestion {
    question: string,
    correctAnswer: boolean,
    options?: boolean[]
}

export interface IChoiceQuestion extends IQuestion {
    question: string,
    correctAnswer: string,
    options: string[]
}

interface IQuiz {
    author: Schema.Types.ObjectId,
    questions: (IBooleanQuestion | IChoiceQuestion)[],
    timePerQuestion: number
}

export const booleanQuestionSchema = new Schema<IBooleanQuestion>({
    question: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: Boolean,
        required: true
    },
    options: {
        type: [Boolean],
        default: [true, false]
    },
    questionType: {
        type: String,
        default: QuestionType.Boolean
    }
})

export const choiceQuestionSchema = new Schema<IChoiceQuestion>({
    question: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
    },
    questionType: {
        type: String,
        default: QuestionType.Choice
    }
})

// TODO: Figure out a better way for multiple type questions
const quizSchema = new Schema<IQuiz>({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    questions: {
        type: [choiceQuestionSchema, booleanQuestionSchema],
        default: []
    }
})

export default model("Quiz", quizSchema)