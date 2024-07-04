import React, { useEffect, useState } from "react"
import { useChat } from "../../Context/ChatProvider"
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getFullEndUser } from "../../Utils/chatUtil"
import { selectedChatDefaultValues } from "../../Context/ChatProvider"
import Profile from "../modals/ProfileModal"
import GroupChatModal from "../modals/GroupChatModal"
import { Message } from "../../Types/types"
import axios from "axios"
import MessageBox from "./MessageBox"

type InnerChatProps = {
  reFetch: boolean
  setReFetch: (value: boolean) => void
}

const InnerChatBox = ({ reFetch, setReFetch }: InnerChatProps) => {
  const { user, selectedChat, setSelectedChat } = useChat()
  const toast = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  // -------------------------------------------------
  async function fetchMessages(): Promise<void> {
    if (selectedChat === selectedChatDefaultValues) return

    setLoading(true)

    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      console.log(data)

      setMessages(data)
      setLoading(false)
    } catch (err: any) {
      toast({
        title: "An Error Occurred!",
        description: "Failed to load messages!",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      })
    }
  }

  async function sendMessage(
    e: React.KeyboardEvent<HTMLInputElement>
  ): Promise<void> {
    if (e.key === "Enter" && newMessage) {
      setNewMessage("")

      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/message",
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          {
            headers: {
              "COnetent-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        console.log(data)

        setMessages([...messages, data])
      } catch (err: any) {
        toast({
          title: "An Error Occurred!",
          description: "Failed to send message!",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [selectedChat])

  // -------------------------------------------------

  return (
    <>
      {selectedChat !== selectedChatDefaultValues ? (
        /* Display chat header and contents  */
        <>
          <Box
            w="100%"
            display="flex"
            alignItems="center"
            p="8px 10px"
            mb="10px"
            bg="#504f50"
            borderRadius="lg"
          >
            <IconButton
              onClick={() => setSelectedChat(selectedChatDefaultValues)}
              icon={<ArrowBackIcon />}
              display={{ base: "flex", md: "none" }}
              aria-label={""}
            />

            <Text
              display="flex"
              w="100%"
              ml="8px"
              justifyContent="space-between"
              alignItems="center"
              fontSize="2xl"
              color="#81A739"
            >
              {/* Chat Header */}
              {!selectedChat.isGroupChat ? (
                <>
                  {getFullEndUser(user, selectedChat.users).name}

                  <Profile
                    user={getFullEndUser(user, selectedChat.users)}
                    children={undefined}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName}
                  <GroupChatModal reFetch={reFetch} setReFetch={setReFetch} 
                    fetchMessages={fetchMessages}
                  />
                </>
              )}
            </Text>
          </Box>

          <Box
            display="flex"
            flexDir="column"
            w="100%"
            h="100%"
            p="10px"
            overflowY="auto"
            bg="#504f50"
            borderRadius="lg"
            justifyContent="flex-end"
          >
            {loading ? (
              <Spinner
                size="xl"
                color="#81A739"
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <section>
                <MessageBox messages={messages} />
              </section>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt="6px">
              <Input
                variant="filled"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        /* if selectedChat is not present */
        <Box display="flex" alignItems="center" h="100%">
          <Text
            fontSize="3xl"
            fontWeight="thin"
            color="#81A739"
            textAlign="center"
          >
            Choose a chat to start texting
          </Text>
        </Box>
      )}
    </>
  )
}

export default InnerChatBox
