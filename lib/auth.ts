import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            accessToken?: string;
            refreshToken?: string;
        } & DefaultSession['user'];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async session({ token, session }) {

            console.log("token", token);
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.picture as string
            }

            return session
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
    },
};
