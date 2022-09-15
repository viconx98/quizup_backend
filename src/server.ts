import dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import morgan from "morgan"
import authRouter from "./routes/auth.route.js"
import quizRouter from "./routes/quiz.route.js"
import jwt from "jsonwebtoken"
import { Events, QuizRoom, QuizRooms, User, UserRequest } from "./types/types.js"
import { Server } from "socket.io"
import quizModel from "./models/quiz.model.js"


const expressApp = express()

expressApp.use(cors())
expressApp.use(express.json())
expressApp.use(morgan("dev"))

expressApp.get("/", (request: Request, response: Response) => {
    return response.status(200).send("Quizup API is up and running")
})

expressApp.use("/auth", authRouter)
expressApp.use(authorize)

expressApp.use("/quiz", quizRouter)

let expressServer: any = null
let socketServer: Server

const DB_URI = process.env.DB_URI
const PORT = process.env.PORT || 3001

const quizRooms: QuizRooms = {

}

function getRandomRoomId(min = 100000, max = 1000000) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomAvatar(hashLength = 10) {
    const charPool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    const chars: string[] = []

    for (let i = 0; i < hashLength; i++) {
        const randIndex = Math.floor(Math.random() * charPool.length)
        chars.push(charPool[randIndex])
    }

    return `https://avatars.dicebear.com/api/personas/${chars.join("")}.svg`
}

mongoose.connect(DB_URI!)
    .then(result => {
        console.log("Connected to database")

        expressServer = expressApp.listen(PORT, () => console.log("Express server up and running on", PORT))

        socketServer = new Server(expressServer, { cors: { origin: "*" } })

        socketServer.on("connection", (socket) => {
            console.log(`[SOCKET] ${socket.id}: Connected`)

            socket.on(Events.RunQuiz, async (data) => {
                console.log(`[SOCKET] ${socket.id}: ${Events.RunQuiz}: ${data} `)

                const quizId = data.quizId
                const adminId = data.adminId

                const quiz = await quizModel.findById(quizId)

                const roomPin = getRandomRoomId()

                const newRoom: QuizRoom = {
                    admin: adminId,
                    adminSocketId: socket.id,
                    quizId: quizId,
                    quiz: quiz!,
                    currentIndex: 0,
                    pin: roomPin,
                    players: [],
                    status: "waiting"
                }

                quizRooms[roomPin] = newRoom

                socketServer.to(socket.id).emit(Events.QuizCreated, newRoom)
                socket.join(roomPin.toString())
            })
            
            socket.on(Events.JoinQuiz, (data) => {
                const roomPin = data.roomPin
                const username = data.username

                if (quizRooms[roomPin] === undefined) return
                
                const player = {
                    socketId: socket.id,
                    username: username,
                    avatar: randomAvatar()
                }

                quizRooms[roomPin].players.push(player)
                quizRooms[roomPin].status = "waiting"

                // Send to player
                socketServer.to(socket.id).emit(Events.QuizJoined, {
                    player, roomPin
                })
                
                // Send to admin
                socketServer.to(quizRooms[roomPin].adminSocketId).emit(Events.PlayerJoined, quizRooms[roomPin])
                
                // Associate socket with room
                socket.join(roomPin.toString())
            })

            socket.on(Events.StartQuiz, (roomPin) => {
                if (quizRooms[roomPin] === undefined) return
                
                quizRooms[roomPin].status = "playing"
                
                // Send to admin
                socketServer.to(quizRooms[roomPin].adminSocketId).emit(Events.QuizStarted, quizRooms[roomPin])
            
                
            })









        })
    })
    .catch(error => {
        console.error("Connection to database failed with", error)
        console.error("Server will not be started")
    })

function authorize(request: UserRequest, response: Response, next: () => void) {
    const authorization = request.headers.authorization

    try {
        if (authorization === null || authorization === undefined) {
            throw new Error("Invalid access token")
        }

        const token = authorization.split(" ")[1]
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)

        request.user = payload as User

        next()
    } catch (error) {
        console.error(error)
        return response.status(403)
            .json({ error: true, message: error.message })
    }
}