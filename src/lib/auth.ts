import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and Password required");
                }

                await dbConnect();

                const user: any = await User.findOne({
                    email: credentials.email.toLowerCase()
                }).select("+password");

                if (!user) {
                    throw new Error("No user found with this email");
                }

                const isMatch = await user.isPasswordValid(credentials.password);

                if (!isMatch) {
                    throw new Error("Incorrect Password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    jwt: {
        maxAge: 30 * 24 * 60 * 60,
        secret: process.env.NEXTAUTH_SECRET,
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/signin",
    },
    debug: process.env.NODE_ENV === 'development',
}