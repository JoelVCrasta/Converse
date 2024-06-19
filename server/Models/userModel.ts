import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { Document } from "mongoose"

// Interface for User
export interface IUser extends Document {
  name: string
  email: string
  password: string
  picture: string
  matchPassword: (enteredPassword: string) => Promise<boolean>
}

const userModel = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },

    email: { type: String, trim: true, required: true, unique: true },

    password: { type: String, required: true },

    picture: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
)

// Compare password with hashed password
userModel.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Hash password before saving
userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export default mongoose.model<IUser>("User", userModel)
