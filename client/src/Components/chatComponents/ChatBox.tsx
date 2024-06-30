import { Box } from "@chakra-ui/react"
import { useChat } from "../../Context/ChatProvider.tsx"
import InnerChatBox from "./InnerChatBox.tsx"

type ChatBoxProps = {
  reFetch: boolean
  setReFetch: (value: boolean) => void
}

const ChatBox = ({ reFetch, setReFetch }: ChatBoxProps) => {
  const { selectedChat } = useChat()

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      bg="#2F2D2E"
      w={{ base: "100%", md: "70%" }}
      p="6px"
      m="12px 12px 0px 12px"
      borderRadius="lg"
      borderWidth="1px"
    >
      <InnerChatBox reFetch={reFetch} setReFetch={setReFetch} />
    </Box>
  )
}

export default ChatBox
