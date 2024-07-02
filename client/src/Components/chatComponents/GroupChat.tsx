import { ReactNode, useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react"
import { User } from "../../Types/types"
import { useChat } from "../../Context/ChatProvider"
import axios from "axios"
import { SpinnerIcon } from "@chakra-ui/icons"
import UserList from "../misc/UserList"
import UserBadge from "../misc/UserBadge"

type GroupChatChild = {
  children: ReactNode
}

const GroupChat = ({ children }: GroupChatChild) => {
  const { user, chats, setChats } = useChat()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [groupChatName, setGroupChatName] = useState<string>("")
  const [groupChatUsers, setGroupChatUsers] = useState<User[]>([])
  const [_search, setSearch] = useState<string>("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // -------------------------------------------------

  async function handleSearch(query: string): Promise<void> {
    if (!query) return

    setSearch(query)

    try {
      setLoading(true)

      const { data } = await axios.get(
        `http://localhost:4000/api/user?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      console.log(data)
      setSearchResults(data)
      setLoading(false)
    } catch (err: any) {
      toast({
        title: err.response.data.message,
        description: "User Search Failed",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      })
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!groupChatName || groupChatUsers.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please provide a valid chat name and users",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      })
      return
    }
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(groupChatUsers.map((user) => user._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setChats([...chats, data])
      onClose()

      toast({
        title: "Group Chat Created",
        description: "Group Chat has been created successfully",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      })
    } catch (err: any) {
      toast({
        title: "Failed to Create Group Chat",
        description: err.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      })
    }
  }

  function handleGroup(user: User): void {
    if (groupChatUsers.includes(user)) {
      toast({
        title: "User Already Added",
        description: "User is already added to the group chat",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      })
    } else {
      setGroupChatUsers([...groupChatUsers, user])
    }
  }

  function removeUser(name: string): void {
    setGroupChatUsers(groupChatUsers.filter((user) => user.name !== name))
  }

  // -------------------------------------------------

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent bg="#2F2D2E">
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="38px"
            fontWeight="thin"
          >
            Create Group Chat
          </ModalHeader>

          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Chat Name"
                mb="10px"
              />
            </FormControl>

            <FormControl>
              <Input
                onChange={(e) => {
                  handleSearch(e.target.value)
                }}
                placeholder="Add Users"
                mb="8px"
              />
            </FormControl>

            {/* show selected uses */}
            <Box
              display="flex"
              flexDir="row"
              alignItems="center"
              justifyContent="center"
              columnGap="5px"
              w="100%"
            >
              {groupChatUsers.map((user: User) => (
                <UserBadge
                  key={user._id}
                  name={user.name}
                  handleFunction={() => removeUser(user.name)}
                />
              ))}
            </Box>

            {/* show searched users */}
            {loading ? (
              <SpinnerIcon />
            ) : (
              searchResults
                .slice(0, 4)
                .map((user: User) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button bg="#81A739" mr={3} onClick={onClose}>
              Close
            </Button>

            <Button bg="#81A739" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChat
