import { Request, Response } from "express"
import expressAsyncHandler from "express-async-handler"
import Message from "../Models/messageModel"
import User from "../Models/userModel"
import Chat from "../Models/chatModel"

const sendMessage = expressAsyncHandler(async (req: Request, res: Response) => {
  const { content, chatId } = req.body

  if (!content || !chatId) {
    console.error("Content or chatId is missing.")
    res.status(400)
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  }

  try {
    let message = await Message.create(newMessage)

    message = await message.populate("sender", "name picture")
    message = await message.populate("chat")
    message = (await User.populate(message, {
      path: "chat.users",
      select: "name picture email",
    })) as any

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    })

    res.json(message)
  } catch (err: any) {
    res.status(400)
    throw new Error(err.message)
  }
})

const allMessages = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name picture")
      .populate("chat")

    res.json(messages)
  } catch (err: any) {
    res.status(400)
    throw new Error(err.message)
  }
})

export { sendMessage, allMessages }
