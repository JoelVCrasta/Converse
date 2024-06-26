import { useState } from "react"
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
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
} from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { useChat } from "../../Context/ChatProvider"
import { useNavigate } from "react-router-dom"
import Profile from "./Profile"

const SideChatDrawer = () => {
  const { user } = useChat()
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingChat, setLoadingChat] = useState<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  function handleLogout(): void {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        /* bg="white" */
        w="100%"
        p="5px 10px"
        borderWidth="4px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button onClick={onOpen} variant="ghost">
            <i className="fa-solid fa-magnifying-glass "></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Seach User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontWeight="thin">
          CONVERSE
        </Text>

        <section>
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
              <ChevronDownIcon ml="8px" mt="8px" />
            </MenuButton>

            <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>

              <MenuDivider />

              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </section>
      </Box>

      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#2F2D2E">
          <DrawerHeader></DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideChatDrawer
