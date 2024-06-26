import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { useState } from "react"
import { useChat } from "../../Context/ChatProvider"

const SideChatDrawer = () => {
  const { user } = useChat()
  const [search, setSearch] = useState<string>("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingChat, setLoadingChat] = useState<boolean>(false)

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      /* bg="white" */
      w="100%"
      p="5px 10px"
      borderWidth="4px"
      borderRadius="10px"
    >
      <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost">
          <i className="fa-solid fa-magnifying-glass "></i>
          <Text display={{ base: "none", md: "flex" }} px="4">
            Seach User
          </Text>
        </Button>
      </Tooltip>

      <Text fontSize="2xl" fontWeight="semibold">
        Converse
      </Text>

      <div>
        <Menu>
          <MenuButton p="1">
            <BellIcon fontSize="2xl" m="1" />
          </MenuButton>
          {/* <MenuList>

          </MenuList> */}
        </Menu>
        <Menu>
          <MenuButton as={Button}>
            <Avatar
              size="sm"
              cursor="pointer"
              name={user?.name}
              src={user?.picture}
            />
            <ChevronDownIcon />
          </MenuButton>
          <MenuList>
            <MenuItem>My Profile</MenuItem>
            <MenuDivider />
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box>
  )
}

export default SideChatDrawer
