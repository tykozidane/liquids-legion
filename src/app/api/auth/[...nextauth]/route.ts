// import { authOption3 } from "@/lib/authOption3";
import { authOptions } from "@/lib/authOptions";
// import authOptions2 from "@/lib/authOptions2";
import NextAuth from "next-auth/next";
// import { authOptions } from "../../../../lib/authOptions";

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST }

// import { handlers } from "../../../../../lib/auth" // Referring to the auth.ts we just created
// export const { GET, POST } = handlers