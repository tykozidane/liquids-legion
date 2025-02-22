import { checkAuthJWTUser } from "@/lib/checkAuthJWT";
import { query } from "@/lib/db";
import { encrypt } from "@/lib/useAes256";
import moment from "moment";
import {  NextResponse } from "next/server";

type Transaction = {
    id: string
    date: string
    items: any
    price: number
    delivery_price: number
    total_price: number
    payment_type: string
    buyer_from: string
    address: string
    status: string
    created_at: string
    created_by: string
    updated_at:string
    updated_by: string
    deleted_at: string
    deleted_by: string
}

export async function POST(request: Request) {
    try {
        // console.log("Start")
        const {userId, from, to} = await request.json();
        const checkJWT = await checkAuthJWTUser(request, userId);
        if(!checkJWT.status) return NextResponse.json({status: "99", message: checkJWT.message, data:{}}, {status: 200})
            console.log("Timestamp : " + from + " to " + to)
        
        //Decrypt user Id
        // const user_id = await decrypt(userId);
        if(!from || !to){
        return NextResponse.json({status: "300", message: "Timestamp from or to is Undefined", data:{}}, {status: 200})
        }
        const timestampFrom = moment(from).format("YYYY-MM-DD HH:mm:ss");
        const timestampTo = moment(to).format("YYYY-MM-DD 23:59:59");
        const findTransaction = await query<Transaction>(
            `select * from opr.transactions t where t."date" between '${timestampFrom}' and '${timestampTo}' `
          );
        const dataSend = await  Promise.all(
            findTransaction.map(async (item:any)=>{
                return new Promise(async (resolve)=> {
                    const item_id = await encrypt(item.id);
                    const user = {
                        id: item_id,
                        date: item.date ,
                        items: item.items ,
                        price: item.price ,
                        delivery_price: item.delivery_price ,
                        total_price: item.total_price ,
                        payment_type: item.payment_type ,
                        buyer_from: item.buyer_from ,
                        address: item.address ,
                        status: item.status ,
                        created_at: item.created_at ,
                        created_by: item.created_by ,
                        updated_at: item.updated_at ,
                        updated_by: item.updated_by ,
                        deleted_at: item.deleted_at ,
                        deleted_by: item.deleted_by 
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