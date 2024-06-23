import expressAsyncHandler from "express-async-handler"
import Chat from "../Models/chatModel"
import User from "../Models/userModel"

const postChats = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    res.status(400)
    throw new Error("User ID is required")
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage")

  isChat = (await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email picture",
  })) as any

  if (isChat.length > 0) {
    res.send(isChat[0])
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    }

    try {
      const createdChat = await Chat.create(chatData)

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      )

      res.status(200).send(FullChat)
    } catch (err: any) {
      res.status(400)
      throw new Error(err)
    }
  }
})

const getChats = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = (await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email picture",
        })) as any

        res.status(200).send(results)
      })
  } catch (err: any) {
    res.status(400)
    throw new Error(err)
  }
})

const createGroup = expressAsyncHandler(async (req, res) => {

})

export { postChats, getChats, createGroup }
