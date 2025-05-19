import { NextAuthOptions } from "next-auth";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider  from "next-auth/providers/credentials";

const { BASE_URL_API } = process.env

export const EXP_SESSION = 12 * 60 * 60 // 12 hours
// const EXP_SESSION = 24 * 60 * 60 // 1 days
// const EXP_SESSION = 10 // 10 seconds

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 10 * 60 * 60 // 10 hours
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
      async authorize(credentials) {
        // console.log("start")
        const res = await fetch(`${BASE_URL_API}/api/auth/login`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
              password: credentials?.password,
          }),
      });
          // console.log("lewat", req)
        
          const data: any = await res.json();
          // console.log("LOGIN :", data)

        if (res.ok) {
                    if (data) {
                        data.data.expired_at = Date.now() + EXP_SESSION * 1000      // SET NEXTAUTH SESSION EXP
                        return data.data;
                    } else {
                        throw new Error("Invalid email or password")
                    }
                } else {
                    throw new Error(data.message)
                }
      },
    }),
  ],
  callbacks: {
    async redirect({ url }) {
      // console.log("URL", url)
      // console.log("baseURL", baseUrl)
      const callback = url.replace(`${BASE_URL_API}/login?callbackUrl=`,"")
      const newURL = callback.replaceAll("%2F", "/")
      // console.log("newURL", newURL)
      // Allows relative callback URLs
      // if (url.startsWith("/")) return `${newURL}`
      // // Allows callback URLs on the same origin
      // else if (new URL(url).origin === baseUrl) return url
      return newURL
    },
    jwt: async ({ user, token, trigger, session }) => {
      // console.log("JWT", {user,token,trigger,session})
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    session: async ({session, token}) => {
      // console.log("Session Callback", {session, token, user})
      return {
        ...session,
        user: { ...session.user, userId: token.userId, username: token.username, token: token.token },
      }
    }
  },
};