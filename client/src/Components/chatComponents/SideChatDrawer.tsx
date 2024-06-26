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
  DrawerBody,
  Input,
  useToast,
} from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons"
import { useChat } from "../../Context/ChatProvider"
import { User } from "../../Types/types"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Profile from "./Profile"
import UsersLoading from "./UsersLoading"
import UserList from "../userList/UserList"

const SideChatDrawer = () => {
  const { user, selectedChat } = useChat()
  const navigate = useNavigate()
  const toast = useToast()
  const [search, setSearch] = useState<string>("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingChat, setLoadingChat] = useState<boolean>(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  function handleLogout(): void {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  async function handleSearch(): Promise<void> {
    if (!search) {
      toast({
        title: "Enter something to search",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top-left",
      })
    }

    setLoading(true)

    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/user?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )

      setLoading(false)

      setSearchResults(data)
    } catch (err: any) {
      toast({
        title: "An Error Occured!",
        description: "Search results couldn't be loaded",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top-left",
      })
    }
  }

  async function accessChat(userId: string): Promise<void> {
    setLoadingChat(true)

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/chat",
        { userId },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      )

      /* setChat(data) */

      setLoadingChat(false)
      onClose()
    } catch (err: any) {}
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
          <DrawerHeader fontWeight="thin" fontSize="24px">
            Search users
          </DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb="4px" mb="8px">
              <Input
                placeholder="Search name or email"
                mr="4px"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />

              <Button onClick={handleSearch}>
                <SearchIcon />
              </Button>
            </Box>
            {loading ? (
              <UsersLoading />
            ) : (
              searchResults?.map((user) => {
                return (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                )
              })
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideChatDrawer
