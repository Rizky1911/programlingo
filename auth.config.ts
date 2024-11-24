/* eslint-disable @typescript-eslint/no-explicit-any */
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"

import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs";
import { db } from "./lib/db";

export default {
  trustHost: true,
  providers: [
    Credentials({
        async authorize(credentials): Promise<any> {
            const validatedFields = LoginSchema.safeParse(credentials);

            if (validatedFields.success) {
                const { email, password } = validatedFields.data;

                const user = await db.user.findUnique({
                    where: {email}
                })

                if (!user || !user.password) return null;

                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (passwordMatch) return user;
            }
            return null;
        }
    })
  ],
} satisfies NextAuthConfig