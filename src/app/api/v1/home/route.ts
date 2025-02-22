import { query } from "@/lib/db";
// import { encrypt } from "@/lib/useAes256";
import {  NextResponse } from "next/server";


export async function GET() {
    try {
        // console.log("Start")
        // const {} = await request.json();
        
        //Decrypt user Id
        // const user_id = await decrypt(userId);
        const dataHome = await query(`
            select *  from home_page where b_active = true
            `)

        return NextResponse.json({status: "00", message: "Get Data Succesfully", data:dataHome[0]}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1001", message: "Failed to get Data", data:{message: err.message}}, {status: 200})
    }
}