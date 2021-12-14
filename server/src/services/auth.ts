import jwt from "jsonwebtoken"
import { User } from "../graphql"

export function authenticate(user: User) {
  const payload = {
    userId: user.id,
    userName: user.name
  }
  const token = jwt.sign(payload, process.env.token || "SECRET", {
    expiresIn: '15 days'
  })

  return token
}