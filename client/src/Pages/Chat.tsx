import { Box, Container } from "@chakra-ui/react"
import { useChat } from "../Context/ChatProvider"
import SideChatDrawer from "../Components/chatComponents/SideChatDrawer"
import UserChats from "../Components/chatComponents/UserChats"
import ChatBox from "../Components/chatComponents/ChatBox"

const Chat = () => {
  const { user } = useChat()

  return (
    <Container maxW="100vw" h="100vh" bg="#2F2D2E">
      {user && <SideChatDrawer />}

      <Box display="flex" justifyContent="space-between" w="100%" h="90vh">
        {user && <UserChats />}
        {user && <ChatBox />}
      </Box>
    </Container>
  )
}

export default Chat
