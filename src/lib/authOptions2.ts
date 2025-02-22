import NextAuth, { NextAuthOptions } from "next-auth"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "pg"
 
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "./db";
import bcrypt from 'bcrypt'
import { ZodError } from "zod"
type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    image: string;
    role:string;
  };
 const authOptions2: NextAuthOptions = NextAuth({
  adapter: PostgresAdapter(pool),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const findUser = await query<User>(
            'select * from users where email = $1',
            [ credentials?.email]
          );
        console.log("Check Res", findUser)
        if(findUser.length < 1){
            throw new Error("Invalid credentials.")
            }
    
            const passwordCorrect = await bcrypt.compare(
                credentials?.password as string,
                findUser[0].password
              );
            if(!passwordCorrect){
                throw new Error("Invalid credentials.")
                }
        const user = {
            userId: findUser[0].id,
            email: findUser[0].email,
            username: findUser[0].name,
            image: findUser[0].image,
            // role: findUser[0].role
        };

        // If no error and we have user data, return it
        return user as any
         
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }
        }
      },
     
    }),
  ],
})

export default authOptions2