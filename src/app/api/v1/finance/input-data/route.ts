import {  NextResponse } from "next/server";
// import moment from "moment";
// import { decrypt } from "@/lib/useAes256";
import { checkAuthJWTAdmin } from "@/lib/checkAuthJWT";
import { query } from "@/lib/db";
import moment from "moment";


export async function POST(request: Request) {
    try {
        const {userId, dataFinance} = await request.json();

        const checkJWT = await checkAuthJWTAdmin(request, userId);
        if(!checkJWT.status) return NextResponse.json({status: "99", message: checkJWT.message, data:{}}, {status: 200})
            console.log("Data", dataFinance)
        const newDate = moment(dataFinance.date).format("YYYY-MM-DD HH:mm:sss");
        const result = await query(
            'INSERT INTO opr.finance (date, type, description, amount, "from", recipt, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [newDate, dataFinance.type, dataFinance.description, dataFinance.amount, dataFinance.from, dataFinance.recipt, checkJWT.data?.username]
          );

        return NextResponse.json({status: "00", message: "Insert Data Succesfully", data: result}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1001", message: "Failed to get Data", data:{message: err.message}}, {status: 200})
    }
}