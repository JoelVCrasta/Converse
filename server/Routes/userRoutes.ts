import express from "express"
import { registerUser, authUser } from "../Controllers/userController"

const router = express.Router()

router.post("/register", registerUser)

router.post("/login", authUser)

export default router
