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
    RunQuiz = "run_quiz",
    QuizCreated = "quiz_created",
    JoinQuiz = "join_quiz",
    QuizJoined = "quiz_joined",
    PlayerJoined = "player_joined",
    StartQuiz = "start_quiz",
    QuizStarted = "quiz_started"
}


export interface QuizRoom {
    admin: string;
    adminSocketId: string;
    pin: number;
    quizId: string;
    players: any[];
    status: "waiting" | "playing" | "completed";
    quiz: IQuiz;
    currentIndex: number;
}

export interface QuizRooms {
    [key: string]: QuizRoom
}