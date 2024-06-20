import expressAsyncHandler from "express-async-handler"
import { Request, Response } from "express"
import User from "../Models/userModel"
import tokenGenerator from "../config/tokenGenerator"

const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, picture } = req.body

    if (!name || !email || !password) {
      res.status(400)
      throw new Error("All fields are required")
    }

    // check if user already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error("User already exists")
    }

    // create user
    const user = await User.create({
      name,
      email,
      password,
      picture,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: tokenGenerator(user._id as any),
      })
    } else {
      res.status(400)
      throw new Error("Invalid user data")
    }
  }
)

const authUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error("All fields are required")
  }

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.status(200)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: tokenGenerator(user._id as any),
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

export { registerUser, authUser }
