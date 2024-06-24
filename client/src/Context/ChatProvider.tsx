import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"

type childProvider = {
  children: ReactNode
}

interface User {
  _id: string
  name: string
  email: string
  picture: string
  token: string
}

type ChatContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const ChatContext = createContext<ChatContextType>({
  user: null,
  setUser: () => {},
})

export const ChatProvider = ({ children }: childProvider) => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    
    if (user) {
      setUser(user)
    } else {
      navigate("/login")
    }
  }, [navigate])

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  return useContext(ChatContext)
}

export default ChatProvider
