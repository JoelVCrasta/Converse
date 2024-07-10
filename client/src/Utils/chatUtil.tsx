import { User, Message } from "../Types/types"

export function getEndUser(logged: User, users: User[]): string {
  if (users.length > 1)
    return users[0]._id === logged._id ? users[1].name : users[0].name
  else return ""
}

export function getFullEndUser(logged: User, users: User[]): User {
  if (users.length > 1) return users[0]._id === logged._id ? users[1] : users[0]
  else return logged
}

export function isSameSender(
  messages: Message[],
  message: Message,
  idx: number,
  loggedId: string
): boolean {
  return (
    idx < messages.length - 1 &&
    (messages[idx + 1].sender._id !== message.sender._id ||
      messages[idx + 1].sender._id === "") &&
    messages[idx].sender._id !== loggedId
  )
}

export function isLastMessage(
  messages: Message[],
  idx: number,
  loggedId: string
): boolean {
  return (
    idx === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== loggedId &&
    Boolean(messages[messages.length - 1].sender._id)
  )
}

export function isSameSenderAlign(
  messages: Message[],
  message: Message,
  idx: number,
  loggedId: string
): number | string {
  if (
    idx < messages.length - 1 &&
    messages[idx + 1].sender._id === message.sender._id &&
    messages[idx].sender._id !== loggedId
  ) {
    return 40
  } else if (
    (idx < messages.length - 1 &&
      messages[idx + 1].sender._id !== message.sender._id &&
      messages[idx].sender._id !== loggedId) ||
    (idx === messages.length - 1 && messages[idx].sender._id !== loggedId)
  ) {
    return 7
  } else {
    return "auto"
  }
}

export function isSameUser(
  messages: Message[],
  message: Message,
  idx: number
): boolean {
  return idx > 0 && messages[idx - 1].sender._id === message.sender._id
}
