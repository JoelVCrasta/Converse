import { useChat } from "../../Context/ChatProvider"
import { Box, IconButton, Text } from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { getFullEndUser } from "../../Utils/chatUtil"
import { selectedChatDefaultValues } from "../../Context/ChatProvider"
import Profile from "../modals/ProfileModal"
import GroupChatModal from "../modals/GroupChatModal"

type InnerChatProps = {
  reFetch: boolean
  setReFetch: (value: boolean) => void
}

const InnerChatBox = ({ reFetch, setReFetch }: InnerChatProps) => {
  const { user, selectedChat, setSelectedChat } = useChat()

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
              fontWeight="thin"
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
                  <GroupChatModal reFetch={reFetch} setReFetch={setReFetch} />
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
          >
            Messages here
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
