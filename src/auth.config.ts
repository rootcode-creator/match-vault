import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import {compare} from 'bcryptjs';
import { loginSchema } from "./lib/schemas/LoginSchema";
import { prisma } from "./lib/prisma";


 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Credentials({
    name: 'credentials',
    async authorize(creds) {
       const validated = loginSchema.safeParse(creds);
       
       if (validated.success) {
        const {email, password} = validated.data;
        
        
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await compare(password, user.passwordHash))) return null;

        return user;
       }

       return null;
    }
  })],
} satisfies NextAuthConfig