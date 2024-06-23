import express from "express"
import protect from "../Middlewares/authMiddleware"
import {
  postChats,
  getChats,
  createGroup,
  renameGroup,
} from "../Controllers/chatController"

const router = express.Router()

router.post("/", protect, postChats)
router.get("/", protect, getChats)

router.post("/group", protect, createGroup)
router.put("/rename", protect, renameGroup)
/* router.put("/add", protect, addGroup)
router.put("/remove", protect, removeGroup) */

export default router
