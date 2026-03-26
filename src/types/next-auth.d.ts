import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module 'next-auth' {
    interface User{
        profileComplete?: boolean;
        role?: Role;
        isOAuth?: boolean;
    }

    interface Session {
        user: {
            profileComplete?: boolean;
            role?: Role;
            isOAuth?: boolean;

        } & DefaultSession['user']
    }
}


declare module 'next-auth/jwt' {

    interface JWT {
        profileComplete?: boolean;
        role?: Role;
        isOAuth?: boolean;
    }
}

