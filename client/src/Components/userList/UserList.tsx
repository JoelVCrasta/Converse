import { Avatar, Box, Text } from "@chakra-ui/react"
import { User } from "../../Types/types"
import { MouseEventHandler } from "react"

type UserListProps = {
  user: User
  handleFunction: MouseEventHandler<HTMLDivElement>
}

const UserList = ({ user, handleFunction }: UserListProps) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#474647"
      _hover={{
        background: "white",
        color: "black",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      px="4px"
      py="6px"
      mb="8px"
      borderRadius="lg"
    >
      <Avatar
        ml="8px"
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.picture}
      />
      <Box ml="12px">
        <Text>{user.name}</Text>
        <Text fontSize="xs">{user.email}</Text>
      </Box>
    </Box>
  )
}

export default UserList
