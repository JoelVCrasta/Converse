import ScrollableFeed from "react-scrollable-feed"
import { Message } from "../../Types/types"
import {
  isLastMessage,
  isSameSender,
  isSameSenderAlign,
  isSameUser,
} from "../../Utils/chatUtil"
import { useChat } from "../../Context/ChatProvider"
import { Avatar, Tooltip } from "@chakra-ui/react"

type MessageBoxProps = {
  messages: Message[]
}

const MessageBox = ({ messages }: MessageBoxProps) => {
  const { user } = useChat()

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message: Message, idx) => {
          return (
            <section key={message._id} style={{ display: "flex" }}>
              {!isSameSender(messages, message, idx, user._id) ||
                (!isLastMessage(messages, idx, user._id) && (
                  <Tooltip
                    label={message.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      size="sm"
                      cursor="pointer"
                      mt="8px"
                      name={message.sender.name}
                      src={message.sender.picture}
                    />
                  </Tooltip>
                ))}

              <span
                style={{
                  backgroundColor: `${
                    message.sender._id === user._id ? "whitesmoke" : "#81A739"
                  }`,
                  color: `${
                    message.sender._id === user._id ? "black" : "white"
                  }`,

                  borderRadius: "8px",
                  padding: "6px 12px",
                  maxWidth: "70%",

                  marginLeft: isSameSenderAlign(
                    messages,
                    message,
                    idx,
                    user._id
                  ),
                  marginTop: isSameUser(messages, message, idx) ? 5 : 10,
                }}
              >
                {message.content}
              </span>
            </section>
          )
        })}
    </ScrollableFeed>
  )
}

export default MessageBox
