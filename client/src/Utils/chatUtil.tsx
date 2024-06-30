import { User } from "../Types/types"

export function getEndUser(logged: User, users: User[]): string {
  if (users.length > 1)
    return users[0]._id === logged._id ? users[1].name : users[0].name
  else return ""
}

export function getFullEndUser(logged: User, users: User[]): User {
  if (users.length > 1) return users[0]._id === logged._id ? users[1] : users[0]
  else return logged
}
