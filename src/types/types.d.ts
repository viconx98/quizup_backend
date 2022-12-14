interface UserResponse {
    id: string;
    name: string;
    email: string;
    iat?: string;
    eat?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    iat?: string;
    eat?: string;
}

interface UserRequest {
    user: User
}