import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

function env(name: string) {
    return process.env[name]?.trim();
}

 
// Notice this is only an object, not a full Auth.js instance
export default {
    callbacks: {
        async jwt({ user, token }) {
            if (user) {
                token.profileComplete = user.profileComplete;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.profileComplete = Boolean(token.profileComplete);
            }

            return session;
        }
    },
    providers: [
        ...(env('GOOGLE_CLIENT_ID') && env('GOOGLE_CLIENT_SECRET')
            ? [Google({
                clientId: env('GOOGLE_CLIENT_ID')!,
                clientSecret: env('GOOGLE_CLIENT_SECRET')!,
                allowDangerousEmailAccountLinking: true,
                authorization: {
                    params: {
                        prompt: 'select_account'
                    }
                }
            })]
            : []),
        ...(env('GITHUB_CLIENT_ID') && env('GITHUB_CLIENT_SECRET')
            ? [Github({
                clientId: env('GITHUB_CLIENT_ID')!,
                clientSecret: env('GITHUB_CLIENT_SECRET')!,
                allowDangerousEmailAccountLinking: true,
                authorization: {
                    params: {
                        scope: 'read:user user:email'
                    }
                },
                profile(profile) {
                    const id = profile.id ?? profile.node_id ?? profile.login;

                    if (!id) {
                        throw new Error('GitHub profile id is missing');
                    }

                    return {
                        id: String(id),
                        name: profile.name ?? profile.login ?? null,
                        email: profile.email ?? null,
                        image: profile.avatar_url ?? null,
                        profileComplete: false,
                    };
                }
            })]
            : []),
    ],
} satisfies NextAuthConfig