import { Request } from "express";
import { IQuiz } from "src/models/quiz.model";

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    iat?: string;
    eat?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    iat?: string;
    eat?: string;
}

export interface UserRequest extends Request {
    user: User
}


export enum Events {
    Location = "location",
    RunQuiz = "run_quiz",
    QuizCreated = "quiz_created",
    JoinQuiz = "join_quiz",
    QuizJoined = "quiz_joined",
    PlayerJoined = "player_joined",
    StartQuiz = "start_quiz",
    QuizStarted = "quiz_started",
    SubmitAnswer = "submit_answer",
    AnswerSubmitted = "answer_submitted",
    NextQuestion = "next_question",
    NewQuestion = "new_question",
    QuizCompleted = "quiz_completed"
}


export interface QuizRoom {
    admin: string;
    adminSocketId: string;
    pin: number;
    quizId: string;
    players: any[];
    status: "waiting" | "playing" | "completed";
    quiz: IQuiz;
    answerData: any;
    currentIndex: number;
    top: any[];
}

export interface QuizRooms {
    [key: string]: QuizRoom
}