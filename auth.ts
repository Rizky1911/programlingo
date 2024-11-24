import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import type { Adapter } from "@auth/core/adapters";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  session: {strategy: "jwt"},
  callbacks: {
    async session({token, session}){
       
        if (token.sub && session.user) {
          session.user.id = token.sub
        }

        return session
    },
    async jwt({ token }){
      if (!token.sub) return token;

      const id = token.sub;

      const existingUser = await db.user.findUnique({
        where: {id}
      });

      if (!existingUser) return token;

      return token;
    }
  },
  ...authConfig,
})