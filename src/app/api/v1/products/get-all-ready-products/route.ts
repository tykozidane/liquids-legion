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
            'select * from opr.products where stock > 0 '
          );
        const dataSend = await  Promise.all(
            findTransaction.map(async (item:any)=>{
                return new Promise(async (resolve)=> {
                    const item_id = await encrypt(item.id);
                    const user = {
                        id: item_id,
                        product: item.product,
                        image: item.image,
                        merek: item.merek,
                        status: item.status,
                        stock: item.stock,
                        price: item.price,
                        created_at: item.created_at
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