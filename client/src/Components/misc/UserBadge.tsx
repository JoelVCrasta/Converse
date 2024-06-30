import { Box, CloseButton } from "@chakra-ui/react"
import { MouseEventHandler } from "react"

type UserBadgeProps = {
  name: string
  handleFunction: MouseEventHandler<HTMLDivElement>
}

const UserBadge = ({ name, handleFunction }: UserBadgeProps) => {
  return (
    <Box
      onClick={handleFunction}
      bg="#81A739"
      borderRadius="lg"
      display="flex"
      pl="8px"
      mb="8px"
      alignItems="center"
    >
      {name}
      <CloseButton ml="4px" />
    </Box>
  )
}

export default UserBadge
