import jwt from "jsonwebtoken"
import User from "../Models/userModel"
import { NextFunction, Request, Response } from "express"
import expressAsyncHandler from "express-async-handler"

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const protect = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1]

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as jwt.JwtPayload

        req.user = await User.findById(decoded.id).select("-password")

        next()
      } catch (err: any) {
        res.status(401)
        throw new Error("Not authorized, token failed")
      }
    }
  }
)

export default protect
