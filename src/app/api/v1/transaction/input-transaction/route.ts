import { NextResponse } from "next/server";
// import moment from "moment";
// import { decrypt } from "@/lib/useAes256";
import { checkAuthJWTAdmin } from "@/lib/checkAuthJWT";
import { query } from "@/lib/db";
import { decrypt } from "@/lib/useAes256";

// interface Items {
//   id: string;
//   image: string;
//   product: string;
//   price: number;
//   peace: number;
// }
export async function POST(request: Request) {
  try {
    const { userId, dataTransaction } = await request.json();

    const checkJWT = await checkAuthJWTAdmin(request, userId);
    if (!checkJWT.status)
      return NextResponse.json(
        { status: "99", message: checkJWT.message, data: {} },
        { status: 200 }
      );
      let purchase_request = "";
      console.log("itemList", dataTransaction.items)
      const dataReady = await  Promise.all(
        dataTransaction.items.map(async (item:any, index:any)=>{
            return new Promise(async (resolve)=> {
                const item_id = await decrypt(item.id);
                const data = {
                    id: item_id,
                    image: item.image,
                    product: item.product,
                    price: item.price,
                    peace: item.peace
                }
                if (index == 0) {
        purchase_request += `SELECT 
            '${item.id}'::uuid AS product_id,  ${item.peace} AS buy_quantity`;
      } else {
        purchase_request += ` UNION ALL SELECT '${item.id}'::uuid AS product_id, ${item.peace} AS buy_quantity`;
      }
                resolve(data)
            })
    }))
    
    console.log("purchase", purchase_request)
//     const bookProduct = await query(`
//             DO $$
// DECLARE
//     insufficient_stock TEXT;
// BEGIN
//     -- Step 1: Validate stock availability
//     WITH purchase_request AS (
//         ${purchase_request}
//     ),
//     stock_check AS (
//         SELECT 
//             pr.product_id,
//             p.product,
//             p.stock,
//             pr.buy_quantity,
//             CASE 
//                 WHEN p.stock < pr.buy_quantity THEN 'Insufficient Stock' 
//                 ELSE NULL 
//             END AS error
//         FROM 
//             purchase_request pr
//         JOIN 
//             opr.products p ON pr.product_id = p.id
//     ),
//     errors AS (
//         SELECT * FROM stock_check WHERE error IS NOT NULL
//     )
//     SELECT 
//         CASE 
//             WHEN EXISTS (SELECT 1 FROM errors) THEN 
//                 (SELECT 'Out of stock: ' || string_agg(product || ' (requested: ' || buy_quantity || ', available: ' || stock || ')', ', ') 
//                  FROM errors)
//             ELSE 
//                 NULL
//         END
//     INTO insufficient_stock;

//     -- Step 2: Check for errors
//     IF insufficient_stock IS NOT NULL THEN
//         RAISE NOTICE '%', insufficient_stock;
//     ELSE
//         -- Step 3: Update stocks
//       WITH purchase_request AS (
//         ${purchase_request}
//     )
//         UPDATE opr.products
//         SET stock = stock - pr.buy_quantity
//         FROM purchase_request pr
//         WHERE opr.products.id = pr.product_id;
//         RAISE NOTICE 'Successfully';
//     END IF;
// END $$;

//             `);
        // console.log('CheckProduct', bookProduct)
    const result = await query(
      "INSERT INTO opr.transactions (date, items, price, delivery_price, total_price, payment_type, buyer_from, address, status, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        dataTransaction.date,
        dataReady,
        dataTransaction.price,
        dataTransaction.delivery_price,
        dataTransaction.total_price,
        dataTransaction.payment_type,
        dataTransaction.buyer_from,
        dataTransaction.address,
        dataTransaction.status,
        checkJWT.data?.username,
      ]
    );

    return NextResponse.json(
      { status: "00", message: "Get Data Succesfully", data: result },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      { status: "1001", message: "Failed to get Data", data: { message: err.message } },
      { status: 200 }
    );
  }
}
