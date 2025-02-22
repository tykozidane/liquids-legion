import { checkAuthJWTUser } from "@/lib/checkAuthJWT";
import { query } from "@/lib/db";
// import { encrypt } from "@/lib/useAes256";
import {  NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        // console.log("Start")
        const {userId, start, to} = await request.json();
        const checkJWT = await checkAuthJWTUser(request, userId);
        if(!checkJWT.status) return NextResponse.json({status: "99", message: checkJWT.message, data:{}}, {status: 200})
        
        //Decrypt user Id
        // const user_id = await decrypt(userId);
        const findTotalRevenue = await query(
            `select sum(price)
from opr.transactions 
where "date" between '${start}' and '${to}'`
          );

          const totalTransaction = await query(`select count(id)
from opr.transactions 
where "date" between '${start}' and '${to}'
`)

        const dataSend = {
            totalRevenue: findTotalRevenue,
            totalTransaction: totalTransaction
        }

        return NextResponse.json({status: "00", message: "Get Data Succesfully", data:dataSend}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1001", message: "Failed to get Data", data:{message: err.message}}, {status: 200})
    }
}