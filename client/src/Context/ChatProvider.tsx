import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { User, Chat } from "../Types/types"

type childProvider = {
  children: ReactNode
}

type ChatContextType = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  selectedChat: Chat
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat>>
  chats: Chat[]
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
}

const userDefaultValues: User = {
  _id: "",
  name: "",
  email: "",
  picture: "",
  token: "",
}

export const selectedChatDefaultValues: Chat = {
  _id: "",
  chatName: "",
  users: [],
  isGroupChat: false,
  latestMessage: "",
  groupAdmin: userDefaultValues,
}

// create context
const ChatContext = createContext<ChatContextType>({
  user: userDefaultValues,
  setUser: () => {},
  selectedChat: selectedChatDefaultValues,
  setSelectedChat: () => {},
  chats: [],
  setChats: () => {},
})

//
//
export const ChatProvider = ({ children }: childProvider) => {
  const navigate = useNavigate()

  const [user, setUser] = useState<User>(userDefaultValues)
  const [selectedChat, setSelectedChat] = useState<Chat>(
    selectedChatDefaultValues
  )
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData") || "{}")

    if (user) {
      setUser(user)
    } else {
      navigate("/login")
    }
  }, [navigate])

  let value = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export const useChat = () => {
  return useContext(ChatContext)
}

export default ChatProvider
