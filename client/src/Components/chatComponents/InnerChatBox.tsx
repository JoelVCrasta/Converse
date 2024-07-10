import React, { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"
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
import { Message, Chat } from "../../Types/types"
import axios from "axios"
import MessageBox from "./MessageBox"

type InnerChatProps = {
  reFetch: boolean
  setReFetch: (value: boolean) => void
}

const ENDPOINT = "http://localhost:4000"
var socket: Socket, selectedChatCheck: Chat

const InnerChatBox = ({ reFetch, setReFetch }: InnerChatProps) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = useChat()
  const toast = useToast()

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [socketConnected, setSocketConnected] = useState<boolean>(false)
  const [typing, setTyping] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  // -------------------------------------------------
  useEffect(() => {
    socket = io(ENDPOINT)
    if (!user) return
    socket.emit("setup", user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop-typing", () => setIsTyping(false))
  }, [user])

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

      socket.emit("join-chat", selectedChat._id)
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
      socket.emit("stop-typing", selectedChat._id)
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
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        )

        socket.emit("send-message", data)

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

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>): void {
    setNewMessage(e.target.value)

    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }

    let lastTypedTime: number = new Date().getTime()
    let timer: number = 3000

    setTimeout(() => {
      let timeNow: number = new Date().getTime()
      let timeDiff: number = timeNow - lastTypedTime

      if (timeDiff >= timer && typing) {
        socket.emit("stop-typing", selectedChat._id)
        setTyping(false)
      }
    }, timer)
  }

  useEffect(() => {
    fetchMessages()

    selectedChatCheck = selectedChat
  }, [selectedChat])

  useEffect(() => {
    socket.on("message-received", (newMessage: Message) => {
      if (!selectedChatCheck || selectedChatCheck._id !== newMessage.chat._id) {
        if (!notifications.includes(newMessage)) {
          setNotifications([newMessage, ...notifications])
          setReFetch(!reFetch)
        }
      } else {
        setMessages([...messages, newMessage])
      }
    })
  })

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
                  <GroupChatModal
                    reFetch={reFetch}
                    setReFetch={setReFetch}
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
              {isTyping && (
                <Box color="whitesmoke" fontWeight="thin">
                  typing...
                </Box>
              )}
              <Input
                variant="filled"
                placeholder="Type a message"
                value={newMessage}
                onChange={handleTyping}
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
