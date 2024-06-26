import { ReactNode } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  IconButton,
  useDisclosure,
  Button,
  Image,
  Text,
} from "@chakra-ui/react"
import { ViewIcon } from "@chakra-ui/icons"
import { User } from "../../Context/ChatProvider.tsx"

type ProfileChild = {
  children: ReactNode
  user: User | null
}

const Profile = ({ children, user }: ProfileChild) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label={""}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />

        <ModalContent bg="#2F2D2E">
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="38px"
            fontWeight="thin"
          >
            {user?.name}
          </ModalHeader>

          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Image
              borderRadius="full"
              boxSize="200px"
              mb="10px"
              src={user?.picture}
              alt={user?.name}
            />

            <Text fontSize={{ base: "16px", md: "22px" }} fontWeight="thin">
              {user?.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Profile
