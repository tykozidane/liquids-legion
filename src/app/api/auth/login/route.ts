import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { encrypt } from "../../../../lib/useAes256";
import bcrypt from 'bcrypt'
import { query } from "@/lib/db";

type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    image: string;
    role:string;
  };

export async function POST(request: Request) {
    try {
        console.log("start")
        const {email, password} = await request.json();
        const findUser = await query<User>(
            'select * from users where email = $1',
            [ email]
          );
        if(findUser.length < 1){
        return NextResponse.json({status: "300", message: "Email is Not Registered", data:{}}, {status: 400})
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            findUser[0].password
          );
        if(!passwordCorrect){
            return NextResponse.json({status: "301", message: "Wrong Password", data:{}}, {status: 400})
            }
        const token = jwt.sign(
            { userId: findUser[0].id,
                email: findUser[0].email,
                username: findUser[0].name,
                image: findUser[0].image,
                role: findUser[0].role},
            process.env.NEXTAUTH_SECRET as string,
            { expiresIn: "24h" }
        )
        const user_id = await encrypt(findUser[0].id)
        const dataSend = {
            userId : user_id,
            username: findUser[0].name,
            email: findUser[0].email,
            image: findUser[0].image,
            token: token
        }
        console.log("DataSend", dataSend)
        return NextResponse.json({status: "00", message: "Login Succesfully", data:dataSend}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1000", message: "Login Failed", data:{message: err.message}}, {status: 200})
    }
}