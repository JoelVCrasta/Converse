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
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  selectedChat: Chat | null
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>
  chats: Chat[]
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
}

// create context
const ChatContext = createContext<ChatContextType>({
  user: null,
  setUser: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  chats: [],
  setChats: () => {},
})

//
//
export const ChatProvider = ({ children }: childProvider) => {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
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
