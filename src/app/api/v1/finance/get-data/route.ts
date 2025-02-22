import { checkAuthJWTUser } from "@/lib/checkAuthJWT";
import { query } from "@/lib/db";
import { encrypt } from "@/lib/useAes256";
import {  NextResponse } from "next/server";

type Products = {
    id: string
    product: string
    image: string
    merek: string
    status: string
    stock: number
    price: number
}

export async function POST(request: Request) {
    try {
        // console.log("Start")
        const {userId} = await request.json();
        const checkJWT = await checkAuthJWTUser(request, userId);
        if(!checkJWT.status) return NextResponse.json({status: "99", message: checkJWT.message, data:{}}, {status: 200})
        
        //Decrypt user Id
        // const user_id = await decrypt(userId);
        const findTransaction = await query<Products>(
            'select * from opr.finance '
          );
        const dataSend = await  Promise.all(
            findTransaction.map(async (item:any)=>{
                return new Promise(async (resolve)=> {
                    const item_id = await encrypt(item.id);
                    const user = {
                        id: item_id,
                        date: item.date,
                        type: item.type,
                        description: item.description,
                        amount: item.amount,
                        from: item.from,
                        recipt: item.recipt,
                        created_by: item.created_by,
                        created_at: item.created_at,
                        updated_by: item.updated_by,
                        updated_at: item.updated_at
                    }
                    resolve(user)
                })
        }))

        return NextResponse.json({status: "00", message: "Get Data Succesfully", data:dataSend}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1001", message: "Failed to get Data", data:{message: err.message}}, {status: 200})
    }
}