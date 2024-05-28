import mongoose from "mongoose"

const userModel = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },

    email: { type: String, trim: true, required: true, unique: true },

    password: { type: String, required: true },

    profilePicture: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("User", userModel)
