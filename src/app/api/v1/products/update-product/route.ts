import {  NextResponse } from "next/server";
// import moment from "moment";
// import { decrypt } from "@/lib/useAes256";
import { checkAuthJWTAdmin } from "@/lib/checkAuthJWT";
import { query } from "@/lib/db";
import { decrypt } from "@/lib/useAes256";
import moment from "moment";


export async function POST(request: Request) {
    try {
        const {userId, dataUpdate, productId} = await request.json();

        const checkJWT = await checkAuthJWTAdmin(request, userId);
        if(!checkJWT.status) return NextResponse.json({status: "99", message: checkJWT.message, data:{}}, {status: 200})

            //Decrypt user Id
        const product_id = await decrypt(productId);
        const timeUpdate = moment().format('YYYY-MM-DD HH:mm:ss.sss')
        console.log(timeUpdate)   
        const result = await query(
            `UPDATE opr.products SET ${dataUpdate}, updated_at = '${timeUpdate}', updated_by = '${checkJWT.data?.username} where id = '${product_id}'`,
          );

        return NextResponse.json({status: "00", message: "Get Data Succesfully", data: result}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1001", message: "Failed to get Data", data:{message: err.message}}, {status: 200})
    }
}