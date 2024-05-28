import express from "express"
import dotenv from "dotenv"

dotenv.config()
const app = express()

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.get("/api/chat", (req, res) => {
  res.json({ message: "Hello from server!" })
})

app.get("/api/chat/:id", (req, res) => {
    
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`PORT: ${PORT}`)
})
