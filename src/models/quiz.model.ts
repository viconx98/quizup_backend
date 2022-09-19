import { Schema, model, connect, Types } from 'mongoose';
import mongoose from 'mongoose';

// TODO: Images for questions
export enum QuestionType {
    Boolean = "boolean",
    Choice = "choice"
}

export interface IQuestion {
    _id?: mongoose.Types.ObjectId;
    question: string;
    correctAnswer: string;
    questionType: QuestionType.Boolean | QuestionType.Choice;
    options: string[];
    image?: string;
}

export interface IQuiz {
    author: Schema.Types.ObjectId;
    title: string;
    questions: IQuestion[];
    timePerQuestion: number;
}

export const questionSchema = new Schema<IQuestion>({
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
        required: true
    },
    image: {
        type: String,
        default: null
    }
})

// TODO: Figure out a better way for multiple type questions
const quizSchema = new Schema<IQuiz>({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        default: []
    },
    timePerQuestion: {
        type: Number,
        default: 60
    }
})

export default model("Quiz", quizSchema)