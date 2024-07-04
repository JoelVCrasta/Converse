import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  IconButton,
  useDisclosure,
  useToast,
  Box,
  Button,
  Input,
  FormControl,
} from "@chakra-ui/react"
import { ViewIcon, SpinnerIcon } from "@chakra-ui/icons"
import { useState } from "react"
import { useChat, selectedChatDefaultValues } from "../../Context/ChatProvider"
import { User } from "../../Types/types"
import UserBadge from "../misc/UserBadge"
import axios from "axios"
import UserList from "../misc/UserList"

type GroupChatModalProps = {
  reFetch: boolean
  setReFetch: (reFetch: boolean) => void
  fetchMessages: () => void
}

const GroupChatModal = ({
  reFetch,
  setReFetch,
  fetchMessages,
}: GroupChatModalProps) => {
  const { user, selectedChat, setSelectedChat } = useChat()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [groupChatName, setGroupChatName] = useState<string>("")
  const [_search, setSearch] = useState<string>("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [renameLoading, setRenameLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // -------------------------------------------------

  async function handleRenameGroup(): Promise<void> {
    if (!groupChatName) {
      toast({
        title: "Chat Name cannot be empty",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setRenameLoading(true)

    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/chat/rename",
        {
          chatId: selectedChat?._id,
          chatName: groupChatName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setSelectedChat(data)
      setReFetch(!reFetch)
      setRenameLoading(false)
    } catch (err: any) {
      toast({
        title: err.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      setRenameLoading(false)
    }

    setGroupChatName("")
  }

  async function handleSearchUser(query: string): Promise<void> {
    if (!query) return

    setSearch(query)
    setLoading(true)

    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/user?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

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

  async function handleAddUser(addUser: User): Promise<void> {
    if (selectedChat.users.find((u: User) => u._id === addUser._id)) {
      toast({
        title: "User already in the group",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "User is not an admin",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      })
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.put(
        "http://localhost:4000/api/chat/add",
        {
          chatId: selectedChat._id,
          userId: addUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      setSelectedChat(data)
      setReFetch(!reFetch)
      setLoading(false)
    } catch (err: any) {
      toast({
        title: "An error occured",
        description: err.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  async function handleRemoveUser(removeUser: User): Promise<void> {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admins can remove users",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      })
      return
    }

    setLoading(true)

    try {
      const { data } = await axios.put(
        "http://localhost:4000/api/chat/remove",
        {
          chatId: selectedChat._id,
          userId: removeUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      // If the user removed is the current user, reset the chat
      removeUser._id === user._id
        ? setSelectedChat(selectedChatDefaultValues)
        : setSelectedChat(data)

      setReFetch(!reFetch)
      fetchMessages()
      setLoading(false)
    } catch (err: any) {
      toast({
        title: "An error occured",
        description: err.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  // -------------------------------------------------

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<ViewIcon />}
        display={{ base: "flex" }}
        aria-label={""}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />

        <ModalContent bg="#2F2D2E">
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="38px"
            fontWeight="thin"
          >
            {selectedChat?.chatName}
          </ModalHeader>

          <ModalBody display="flex" flexDir="column" alignItems="center">
            {/* Display the group users */}
            <Box
              display="flex"
              flexWrap="wrap"
              w="100%"
              columnGap="5px"
              mb="6px"
            >
              {selectedChat?.users.map((user: User) => (
                <UserBadge
                  key={user._id}
                  name={user.name}
                  handleFunction={() => handleRemoveUser(user)}
                />
              ))}
            </Box>

            {/* Form to change group name */}
            <FormControl>
              <Box
                display="flex"
                justifyContent="cenetr"
                alignItems="center"
                columnGap="5px"
              >
                <Input
                  placeholder="Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />

                <Button
                  onClick={handleRenameGroup}
                  isLoading={renameLoading}
                  bg="#81A739"
                >
                  Rename
                </Button>
              </Box>
            </FormControl>

            {/* Form to add users to the group */}
            <FormControl>
              <Box
                display="flex"
                justifyContent="cenetr"
                alignItems="center"
                columnGap="5px"
                mt="20px"
                mb="10px"
              >
                <Input
                  placeholder="Add User to the group"
                  onChange={(e) => handleSearchUser(e.target.value)}
                />
              </Box>
            </FormControl>

            {/* Display the searched users */}
            {loading ? (
              <SpinnerIcon />
            ) : (
              searchResults
                .slice(0, 4)
                .map((user: User) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button bg="red.600" mr={3} onClick={() => handleRemoveUser(user)}>
              Leave
            </Button>

            <Button bg="#81A739" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
