import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connection from "./config/mongodb"
import userRoutes from "./Routes/userRoutes"
import { notFound, errorHandler } from "./Middlewares/errorMiddleware"

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


// Error Middlewares
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`PORT: ${PORT}`)
})
