import { useEffect, useState } from "react"
import { Box, useToast, Text, Button, Stack } from "@chakra-ui/react"
import { useChat } from "../../Context/ChatProvider"
import axios from "axios"
import { AddIcon } from "@chakra-ui/icons"
import UsersLoading from "./UsersLoading"
import { Chat, User } from "../../Types/types"
import { getEndUser } from "../../Utils/chatUtil"

const UserChats = () => {
  const toast = useToast()

  const [logged, setLogged] = useState<User>()
  const { user, selectedChat, setSelectedChat, chats, setChats } = useChat()

  async function getChats() {
    try {
      const { data } = await axios.get("http://localhost:4000/api/chat", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })

      console.log(data)
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
    setLogged(JSON.parse(localStorage.getItem("userInfo") as string))
    getChats()
  }, [])

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
        borderRadius="lg"
        bg="#504f50"
      >
        <Text>Chats</Text>

        <Button
          display="flex"
          fontSize={{ base: "16px", md: "10px", lg: "16px" }}
          rightIcon={<AddIcon />}
        >
          New Group
        </Button>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        w="100%"
        h="100%"
        p="10px"
        mt="10px"
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
                bg={selectedChat === chat ? "#81A739" : "#504f90"}
                borderRadius="lg"
                p="6px 8px"
                h="45px"
              >
                {!chat.isGroupChat && logged ? (
                  getEndUser(logged, chat.users)
                ) : (
                  <Text>{chat.chatName}</Text>
                )}
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
