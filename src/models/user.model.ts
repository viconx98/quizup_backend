import { Schema, model, connect } from 'mongoose';

interface IUser {
    name: string,
    email: string,
    password: string
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default model("User", userSchema)