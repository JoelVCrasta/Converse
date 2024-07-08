import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import * as sock from "socket.io"
import { notFound, errorHandler } from "./Middlewares/errorMiddleware"
import connection from "./config/mongodb"
import userRoutes from "./Routes/userRoutes"
import chatRoutes from "./Routes/chatRoutes"
import messageRoutes from "./Routes/messageRoutes"

dotenv.config()

connection() // connect to MongoDB

const app = express()
app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

// Error Middlewares
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`PORT: ${PORT}`)
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket: sock.Socket) => {
  console.log("Connected to Socket: ")
})
