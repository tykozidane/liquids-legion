import { NextAuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider  from "next-auth/providers/credentials";
import { query } from "./db";
import bcrypt from 'bcrypt'
type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    image: string;
    role:string;
  };
export const authOption3: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider ({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials, req) {
        const findUser = await query<User>(
            'select * from users where email = $1',
            [ credentials?.email]
          );
        const user = findUser[0]
          console.log("lewat", req)

        const passwordCorrect = await bcrypt.compare(
          credentials?.password as string,
          user?.password
        );

        if (passwordCorrect) {
          return {
            userId: user?.id,
            email: user?.email,
            name: user?.name,
            image: user?.image
          } as any;
        }

        console.log("credentials", credentials);
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token, trigger, session }) => {
      // console.log("JWT", {user,token,trigger,session})
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    session: async ({session, token, user}) => {
      console.log("Session Callback", {session, token, user})
      return {
        ...session,
        user: { ...session.user, userId: token.userId, username: token.username },
      }
    }
  },
};