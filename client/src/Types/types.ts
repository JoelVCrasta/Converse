interface User {
  _id: string
  name: string
  email: string
  picture: string
  token: string
}

interface Chat {
    _id: string
    chatName: string
    isGroupChat: boolean
    users: User[]
    latestMessage: string
    groupAdmin: User
}

export type { User }
