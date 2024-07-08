import mongoose from "mongoose"
import colors from "colors"

const conColor = (con: string) => {
  return colors.bgGreen(colors.black(colors.bold(con)))
}

const errColor = (err: string) => {
  return colors.red(colors.bold(err))
}

const connection = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI as string)

    console.log(conColor(`MongoDB connected: ${con.connection.host}`))
  } catch (err: any) {
    console.error(errColor(`ERROR: ${err.message}`))
    process.exit()
  }
}

export default connection
