interface User {
  _id: string
  name: string
  email: string
  picture: string
  token: string
}

interface Message {
  _id: string
  sender: User
  content: string
  chat: Omit<Chat, "latestMessage">
}

interface Chat {
  _id: string
  chatName: string
  isGroupChat: boolean
  users: User[]
  latestMessage: Message
  groupAdmin: User
}

export type { User, Chat, Message }
