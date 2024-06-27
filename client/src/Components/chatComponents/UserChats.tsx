import React, { useEffect } from "react"
import { Box, useToast } from "@chakra-ui/react"
import { useChat } from "../../Context/ChatProvider"
import axios from "axios"

const UserChats = () => {
  const toast = useToast()

  const [logged, setLogged] = React.useState(false)
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
    <Box></Box>
  )
}

export default UserChats
