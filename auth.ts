
import type { DefaultSession, NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import { AuthOptions, getServerSession } from "next-auth"

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            accessToken?: string;
            refreshToken?: string;
        } & DefaultSession["user"]
    }
}

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [Google({
        clientId: process.env.AUTH_GOOGLE_ID || "",
        clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
        authorization: {
            params: {
                scope: "https://www.googleapis.com/auth/calendar https://mail.google.com/ openid email profile",
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
            }
        }
    })], // rest of your config
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token as string
                token.refreshToken = account.refresh_token as string
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
                session.user.accessToken = token.accessToken as string
                session.user.refreshToken = token.refreshToken as string
            }
            return session
        }
    },
} satisfies NextAuthOptions

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }