import { User } from "../Types/types"

export function getEndUser(logged: User, users: User[]): string {
  console.log(logged)
  let u = users[0]._id === logged._id ? users[1].name : users[0].name
  return u
}
