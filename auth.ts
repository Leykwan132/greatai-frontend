
import type { NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import { AuthOptions, getServerSession } from "next-auth"

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
const authOptions: AuthOptions = {
    providers: [Google({
        clientId: process.env.AUTH_GOOGLE_ID || "",
        clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    })], // rest of your config
} satisfies NextAuthOptions

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }