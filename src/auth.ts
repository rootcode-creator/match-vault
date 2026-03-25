import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config"
import { loginSchema } from "./lib/schemas/LoginSchema";
import { compare } from "bcryptjs";

const prisma = new PrismaClient()

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        ...authConfig.providers,
        Credentials({
            name: "credentials",
            async authorize(creds) {
                const validated = loginSchema.safeParse(creds);

                if (validated.success) {
                    const { email, password } = validated.data;

                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user || !user.passwordHash || !(await compare(password, user.passwordHash))) return null;

                    return user;
                }

                return null;
            }
        })
    ],
})