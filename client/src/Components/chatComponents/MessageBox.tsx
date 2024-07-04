import ScrollableFeed from "react-scrollable-feed"
import { Message } from "../../Types/types"

type MessageBoxProps = {
  messages: Message[]
}

const MessageBox = ({ messages }: MessageBoxProps) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message: Message, idx) => {
          return (
            <section key={message._id} style={{ display: "flex" }}>
                
            </section>
          )
        })}
    </ScrollableFeed>
  )
}

export default MessageBox
