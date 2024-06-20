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

interface RegisterProps {
  name: string
  email: string
  password: string
  picture: string
}

const Register = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const [show, setShow] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [loginData, setLoginData] = useState<RegisterProps>({
    name: "",
    email: "",
    password: "",
    picture: "",
  })

  const handlePicture = (picture: File): void => {
    // check if picture is selected
    setLoading(true)

    if (picture === undefined) {
      toast({
        title: "No picture selected",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      })
      return
    }

    // check if picture is a valid image
    if (
      picture.type === "image/jpeg" ||
      picture.type === "image/png" ||
      picture.type === "image/jpg"
    ) {
      const data = new FormData()

      data.append("file", picture)
      data.append("upload_preset", "Converse")
      data.append("cloud_name", "dfactkyhs")

      // upload picture to cloudinary
      axios
        .post("https://api.cloudinary.com/v1_1/dfactkyhs/image/upload", data)
        .then((res) => {
          setLoginData({ ...loginData, picture: res.data.url })
          setLoading(false)
          toast({
            title: "Image uploaded successfully",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "bottom",
          })
        })
        .catch((err) => {
          console.error("Cloudinary error", err)
          setLoading(false)
        })
    } else {
      toast({
        title: "Please select a different image",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      })
    }
  }

  // handle register
  const handleRegister = async (): Promise<void> => {
    setLoading(true)

    if (!loginData.name || !loginData.email || !loginData.password) {
      toast({
        title: "All fields are required",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("/api/user/register", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200) {
        toast({
          title: "User registered successfully",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        })
      }

      localStorage.setItem("userData", JSON.stringify(response.data))
      setLoading(false)

      // redirect to chat
      navigate("/chat")
    } catch (err: any) {
      toast({
        title: "An error occurred",
        description: err.response.data.message,
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

      <FormControl id="text" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your name"
          type="text"
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
        onClick={handleRegister}
        isLoading={loading}
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
