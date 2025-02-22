import {  NextResponse } from "next/server";
// import moment from "moment";
// import { decrypt } from "@/lib/useAes256";
import { checkAuthJWTAdmin } from "@/lib/checkAuthJWT";
import { query } from "@/lib/db";


export async function POST(request: Request) {
    try {
        const {userId, dataItem} = await request.json();

        const checkJWT = await checkAuthJWTAdmin(request, userId);
        if(!checkJWT.status) return NextResponse.json({status: "99", message: checkJWT.message, data:{}}, {status: 200})

        const result = await query(
            'INSERT INTO opr.products (product, image, merek, stock, capital_price, price, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [dataItem.product, dataItem.image, dataItem.merek, dataItem.stock, dataItem.capital_price, dataItem.price, checkJWT.data?.username]
          );

        return NextResponse.json({status: "00", message: "Get Data Succesfully", data: result}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1001", message: "Failed to get Data", data:{message: err.message}}, {status: 200})
    }
}