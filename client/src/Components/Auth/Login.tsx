import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface LoginProps {
  email: string
  password: string
}

const Login = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const [show, setShow] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [loginData, setLoginData] = useState<LoginProps>({
    email: "",
    password: "",
  })

  const handleLogin = async (): Promise<void> => {
    setLoading(true)

    if (!loginData.email || !loginData.password) {
      toast({
        title: "All fields are required",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      })
      return
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        loginData
      )

      if (response.status === 200) {
        toast({
          title: "Login successful",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        })
      }

      localStorage.setItem("userData", JSON.stringify(response.data))
      setLoading(false)

      // redirect to chat
      navigate("/chats")
    } catch (err: any) {
      toast({
        title: err.response.data.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

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
        onClick={handleLogin}
        isLoading={loading}
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
