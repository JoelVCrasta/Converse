import { useEffect, useState } from "react"
import { Box, useToast, Text, Button, Stack } from "@chakra-ui/react"
import { useChat } from "../../Context/ChatProvider"
import axios from "axios"
import { AddIcon } from "@chakra-ui/icons"
import UsersLoading from "../misc/UsersLoading.tsx"
import { Chat, User } from "../../Types/types"
import { getEndUser } from "../../Utils/chatUtil"
import GroupChatModal from "./GroupChat.tsx"

type UserChatsProps = {
  reFetch: boolean
}

const UserChats = ({ reFetch }: UserChatsProps) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = useChat()

  const toast = useToast()

  const [logged, setLogged] = useState<User>()

  // -------------------------------------------------

  async function getChats() {
    if (!user.token) {
      console.error("Token is not available.")
      return
    }

    try {
      const { data } = await axios.get("http://localhost:4000/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      setChats(data)
    } catch (err: any) {
      toast({
        title: err.response.data.message,
        description: "Chats couldn't be loaded",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  useEffect(() => {
    setLogged(JSON.parse(localStorage.getItem("userData") as string))
    if (user.token) getChats()
  }, [reFetch, user.token])

  // -------------------------------------------------

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      m="12px 12px 0px 12px"
      p="6px"
      bg="#2F2D2E"
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        fontSize="20px"
        fontWeight="medium"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        p="10px 10px"
        mb="10px"
        borderRadius="lg"
        bg="#504f50"
      >
        <Text>Chats</Text>

        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "16px", md: "10px", lg: "16px" }}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        w="100%"
        h="100%"
        p="10px"
        overflowY="auto"
        borderRadius="lg"
        bg="#504f50"
      >
        {chats ? (
          <Stack overflow="auto" w="100%">
            {chats.map((chat: Chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#81A739" : "#3f3d3e"}
                borderRadius="lg"
                p="6px 8px"
                h="45px"
              >
                <Text
                  fontSize="16px"
                  fontWeight="thin"
                  color="white"
                  w="100%"
                  display="flex"
                  alignItems="center"
                  ml="4px"
                  mt="3px"
                  isTruncated
                >
                  {chat.isGroupChat == false && logged
                    ? getEndUser(logged, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <UsersLoading />
        )}
      </Box>
    </Box>
  )
}

export default UserChats
