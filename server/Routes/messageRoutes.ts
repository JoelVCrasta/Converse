import express from "express"
import protect from "../Middlewares/authMiddleware"
import { sendMessage, allMessages } from "../Controllers/messageController"

const router = express.Router()

router.post("/", protect, sendMessage)

router.get("/:chatId", protect, allMessages)

export default router
