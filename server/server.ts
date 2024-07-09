import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import * as sock from "socket.io"
import { notFound, errorHandler } from "./Middlewares/errorMiddleware"
import connection from "./config/mongodb"
import userRoutes from "./Routes/userRoutes"
import chatRoutes from "./Routes/chatRoutes"
import messageRoutes from "./Routes/messageRoutes"
import { User, Message } from "./Types/types"

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
  console.log("Connected to Socket")

  socket.on("setup", (user: User) => {
    socket.join(user._id)
    socket.emit("connected")
  })

  socket.on("join-chat", (roomId: string) => {
    socket.join(roomId)
    console.log(`User joined room: ${roomId}`)
  })

  socket.on("typing", (room: string) => {
    socket.in(room).emit("typing")
  })

  socket.on("stop-typing", (room: string) => {
    socket.in(room).emit("stop-typing")
  })

  socket.on("send-message", (newMessage: Message) => {
    var chat = newMessage.chat

    if (!chat.users) return console.log("Chat.users not defined")

    chat.users.forEach((user: User) => {
      if (user._id === newMessage.sender._id) return

      socket.in(user._id).emit("message-received", newMessage)
    })
  })

  socket.off("setup", (userId: string) => {
    console.log("Disconnected from Socket")
    socket.leave(userId)
  })
})
