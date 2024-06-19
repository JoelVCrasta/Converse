import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react"
import React, { HTMLFactory, SetStateAction, useState } from "react"

interface RegisterProps {
  name: string
  email: string
  password: string
  picture: string
}

const Register = () => {
  const [show, setShow] = useState<boolean>(false)
  const [loginData, setLoginData] = useState<RegisterProps>({
    name: "",
    email: "",
    password: "",
    picture: "",
  })

  const handlePicture = (picture: File) => {}

  const handleRegister = (e: React.FormEvent<HTMLButtonElement>) => {}

  return (
    <VStack spacing="6px">
      <FormControl id="name" isRequired>
        <FormLabel>Username</FormLabel>
        <Input
          placeholder="Enter your username"
          value={loginData.name}
          onChange={(e) => {
            setLoginData({ ...loginData, name: e.target.value })
          }}
          bg="#2F2D2E"
          border="none"
          color="#81A739"
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your name"
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

      <FormControl id="picture" mt="8px">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) handlePicture(e.target.files[0])
          }}
          p="4px"
          borderColor="#81A739"
        />
      </FormControl>

      <Button
        type="submit"
        onClick={(e) => {
          handleRegister(e)
        }}
        bg="#81A739"
        w="100%"
        mt="24px"
      >
        Register
      </Button>
    </VStack>
  )
}

export default Register
