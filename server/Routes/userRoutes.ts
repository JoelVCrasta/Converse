import express from "express"
import { registerUser, authUser, allUsers } from "../Controllers/userController"
import protect from "../Middlewares/authMiddleware"

const router = express.Router()

router.post("/register", registerUser)

router.post("/login", authUser)

router.get("/", protect, allUsers)

export default router
