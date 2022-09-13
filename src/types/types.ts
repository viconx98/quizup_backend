import { Request } from "express";

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