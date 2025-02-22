// import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'; 
import { decrypt } from "./useAes256";

  /**
   * Fetch from the swapi API
   *
   * @async
   * @param {Request} req
   */

export async function checkAuthJWT(req: Request) {
    const authHeader = req.headers.get('authorization')
    console.log("auth", authHeader)
    let token = null
    // Check if Authorization header is present and valid
    if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'
  }

  if (!token) {
    return {status: false, message:"Token undefined"}
  }
  const secret = process.env.NEXTAUTH_SECRET || ""
  try {
   const decodeJWT =  jwt.verify(token, secret); // Verify JWT with secret
   
  // Token is valid, allow the request to continue
  return {status: true, message:"Success Decode", data: decodeJWT}
  } catch (error) {
    console.log(error)
    return {status: false, message:"Authorization Failed"}
  }

}

export async function checkAuthJWTUser(req: Request, userId: string) {
  const authHeader = req.headers.get('authorization')
  console.log("auth", authHeader)
  let token = null
  // Check if Authorization header is present and valid
  if (authHeader && authHeader.startsWith('Bearer ')) {
  token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'
}

if (!token) {
  return {status: false, message:"Token undefined"}
}
const secret = process.env.NEXTAUTH_SECRET || ""
try {
 const decodeJWT =  jwt.verify(token, secret) as jwt.JwtPayload; // Verify JWT with secret
 const user_id = await decrypt(userId)
 if(decodeJWT.userId != user_id )   return {status: false, message:"Its Not Your Token"}
// Token is valid, allow the request to continue
return {status: true, message:"Success Decode", data: decodeJWT}
} catch (error) {
  console.log(error)
  return {status: false, message:"Authorization Failed"}
}

}

export async function checkAuthJWTAdmin(req: Request, userId: string) {
  const authHeader = req.headers.get('authorization')
  console.log("auth", authHeader)
  let token = null
  // Check if Authorization header is present and valid
  if (authHeader && authHeader.startsWith('Bearer ')) {
  token = authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'
}

if (!token) {
  return {status: false, message:"Token undefined"}
}
const secret = process.env.NEXTAUTH_SECRET || ""
try {
 const decodeJWT =  jwt.verify(token, secret)as jwt.JwtPayload; // Verify JWT with secret
 const user_id = await decrypt(userId)
 if(decodeJWT.userId != user_id )   return {status: false, message:"Its Not Your Token"}
 if(decodeJWT.role != 'ADMIN' )   return {status: false, message:"You're Not Allowed"}
// Token is valid, allow the request to continue
return {status: true, message:"Success Decode", data: decodeJWT}
} catch (error) {
  console.log(error)
  return {status: false, message:"Authorization Failed"}
}

}