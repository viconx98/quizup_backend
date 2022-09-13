import dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import morgan from "morgan"
import authRouter from "./routes/auth.route.js"


const expressApp = express()

expressApp.use(cors())
expressApp.use(express.json())
expressApp.use(morgan("dev"))

expressApp.get("/", (request: Request, response: Response) => {
    return response.status(200).send("Quizup API is up and running")
})

expressApp.use("/auth", authRouter)

let expressServer: any = null

const DB_URI = process.env.DB_URI
const PORT = process.env.PORT || 3001

mongoose.connect(DB_URI!)
    .then(result => {
        console.log("Connected to database")

        expressServer = expressApp.listen(PORT, () => console.log("Server up and running on", PORT))
    })
    .catch(error => {
        console.error("Connection to database failed with", error)
        console.error("Server will not be started")
    })
