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
  if (!req.body.users || !req.body.name) {
    res.status(400).send("Please fill all the fields")
  }

  let users = JSON.parse(req.body.users)

  if (users.length === 0) {
    res.status(400).send("Please add more users")
  }

  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")

    res.status(200).send(fullGroupChat)
  } catch (err: any) {
    res.status(400)
    throw new Error(err)
  }
})

const renameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password")

    if (!updatedChat) {
      res.status(404)
      throw new Error("Chat not found")
    } else {
      res.json(updatedChat)
    }
  } catch (err: any) {
    res.status(400)
    throw new Error(err)
  }
})

const addGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const addedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

  if (!addedChat) {
    res.status(404)
    throw new Error("Chat not found")
  } else {
    res.json(addedChat)
  }
})

const removeGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body

  const removedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

  if (!removedChat) {
    res.status(404)
    throw new Error("Chat not found")
  } else {
    res.json(removedChat)
  }
})

export { postChats, getChats, createGroup, renameGroup, addGroup, removeGroup }
