import { User } from "../Types/types"

export function getEndUser(logged: User, users: User[]) {
  return users[0]._id === logged._id ? users[1].name : users[0].name
}
