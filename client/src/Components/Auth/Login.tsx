import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"

interface LoginProps {
  email: string
  password: string
}

const Login = () => {
  const [show, setShow] = useState<boolean>(false)
  const [loginData, setLoginData] = useState<LoginProps>({
    email: "",
    password: "",
  })

  const handleLogin = (e: React.FormEvent<HTMLButtonElement>) => {}

  return (
    <VStack spacing="6px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          type="email"
          value={loginData.email}
          onChange={(e) => {
            setLoginData({ ...loginData, email: e.target.value })
          }}
          bg="#2F2D2E"
          border="none"
          color="#81A739"
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your password"
            type={show ? "text" : "password"}
            value={loginData.password}
            onChange={(e) => {
              setLoginData({ ...loginData, password: e.target.value })
            }}
            bg="#2F2D2E"
            border="none"
            color="#81A739"
          />
          <InputRightElement>
            <Button
              onClick={() => {
                setShow(!show)
              }}
              bg="none"
              color="#81A739"
              mr="14px"
              _hover={{ bg: "none" }}
            >
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        type="submit"
        onClick={(e) => {
          handleLogin(e)
        }}
        bg="#81A739"
        w="100%"
        mt="24px"
      >
        Login
      </Button>
    </VStack>
  )
}

export default Login
