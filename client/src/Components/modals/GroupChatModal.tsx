import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  Text,
  IconButton,
  useDisclosure,
  useToast,
  Box,
} from "@chakra-ui/react"
import { ViewIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { useChat } from "../../Context/ChatProvider"
import { User } from "../../Types/types"
import UserBadge from "../misc/UserBadge"

type GroupChatModalProps = {
  reFetch: boolean
  setReFetch: (reFetch: boolean) => void
}

const GroupChatModal = ({ reFetch, setReFetch }: GroupChatModalProps) => {
  const toast = useToast()
  const [groupChatName, setGroupChatName] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [renameLoading, setRenameLoading] = useState<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { user, selectedChat, setSelectedChat } = useChat()

  function removeUser(name: string) {
    const newUsers = selectedChat?.users.filter(
      (user: User) => user.name !== name
    )
    setSelectedChat({ ...selectedChat, users: newUsers })
  }

  useEffect(() => {}, [reFetch])

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
            <Box display="flex" columnGap="5px">
              {selectedChat?.users.map((user: User) => (
                <UserBadge
                  key={user._id}
                  name={user.name}
                  handleFunction={() => removeUser(user.name)}
                />
              ))}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
