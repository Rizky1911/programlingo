import { UserRole } from "@prisma/client"
import /*NextAuth,*/ {type DefaultSession} from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
}

declare module "next-auth" {
  interface Session {
    user: {
      role: string
      id_estate: number | null
      estate_name: string | null
    } & DefaultSession["user"]
  }
}