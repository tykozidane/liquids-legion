import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { query } from '../../../../lib/db';

export async function POST(request: Request) {
    try {
        const {email, password, name} = await request.json();
        const findEmail = await query(
            'select * from users where email = $1',
            [ email]
          );
        //   console.log(findEmail)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        if(findEmail.length > 0){
        return NextResponse.json({status: "300", message: "Email Already Used", data:{}}, {status: 400})
        }
        const result = await query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, 'user']
          );
        // console.log(result)
        return NextResponse.json({status: "00", message: "Registration Succesfully", data:result}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1000", message: "Registration Failed", data:{message: err.message}}, {status: 200})
    }
}