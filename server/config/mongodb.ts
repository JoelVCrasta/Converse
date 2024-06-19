import mongoose from "mongoose"

const connection = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI as string)

    console.log(`MongoDB connected: ${con.connection.host}`)
  } catch (err: any) {
    console.error(`ERROR: ${err.message}`)
    process.exit()
  }
}

export default connection
