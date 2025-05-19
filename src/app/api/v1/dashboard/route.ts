import { checkAuthJWTUser } from "@/lib/checkAuthJWT";
import { query } from "@/lib/db";
import moment from "moment";
// import { encrypt } from "@/lib/useAes256";
import {  NextResponse } from "next/server";

type TotalRevenue = {
    this_month_total: number;
    last_month_total: number;
    percentage_change: number;
}
type TotalTransaction = {
    this_month_count: number;
    last_month_count: number;
    percentage_change: number;
}
type TotalItemSold = {
    this_month_total: number;
    last_month_total: number;
    percentage_change: number;
}
type BestSellerItem = {
    product: string;
    total_sales: number
}
type ChartSalesSummary = {
    sales_summary: {
        month: string;
        sales: number;
    }
}
type CompareTotal = {
    monthly_summary: {
    this_month: string;
    total_this_month: number;
    transaction_this_month: number;
    last_month: string;
    total_last_month: number;
    transaction_last_month: number;
    total_high_this_month : boolean;
    percentage_total : string;
    transaction_high_this_month: boolean;
    percentage_transaction: string;
    }
}
type BestSellerProductThisYear = {
    top_products : {
        total:number;
        number:number;
        product:string;
        image:string;
    }[]
}
type Last6Transaction = {
    recent_transactions : {
        id: string;
        date:string;
        total: number;
        products: [];
        buyer_from: string
    }[]
}
type transactionFW = {
    this_month_count: number;
    last_month_count: number;
    percentage_change: number;
}


export async function POST(request: Request) {
    try {
        // console.log("Start")
        const {userId} = await request.json();
        const checkJWT = await checkAuthJWTUser(request, userId);
        if(!checkJWT.status) return NextResponse.json({status: "99", message: checkJWT.message, data:{}}, {status: 200})
        
            const monthName = moment().format('MMMM YYYY');

        //Decrypt user Id
        // const user_id = await decrypt(userId);
        const findTotalRevenue = await query<TotalRevenue>(
            `WITH totals AS (
    SELECT
        SUM(CASE
            WHEN created_at >= date_trunc('month', CURRENT_DATE)
                THEN price
            ELSE 0
        END) AS this_month_total,
        SUM(CASE
            WHEN created_at >= date_trunc('month', CURRENT_DATE) - interval '1 month'
            AND created_at < date_trunc('month', CURRENT_DATE)
                THEN price
            ELSE 0
        END) AS last_month_total
    FROM opr.transactions
)
SELECT 
    this_month_total,
    last_month_total,
    ROUND(
        CASE 
            WHEN last_month_total = 0 THEN
                CASE 
                    WHEN this_month_total = 0 THEN 0
                    ELSE this_month_total / 1000
                END
            else
            CASE
            WHEN this_month_total = 0 THEN
                (1 / last_month_total) * 100
                    ELSE (this_month_total / last_month_total) * 100
                END
        END, 2
    ) AS percentage_change
from totals;
`
        );

        const totalTransaction = await query<TotalTransaction>(`WITH totals AS (
    SELECT
        COUNT(*) FILTER (
            WHERE created_at >= date_trunc('month', CURRENT_DATE)
        ) AS this_month_count,
        
        COUNT(*) FILTER (
            WHERE created_at >= date_trunc('month', CURRENT_DATE) - interval '1 month'
            AND created_at < date_trunc('month', CURRENT_DATE)
        ) AS last_month_count
    FROM opr.transactions
)
SELECT 
    this_month_count,
    last_month_count,
    ROUND(
        CASE 
            WHEN last_month_count = 0 THEN
                CASE 
                    WHEN this_month_count = 0 THEN 0
                    ELSE this_month_count * 100
                END
            else
            CASE
            WHEN this_month_count = 0 THEN
                (1 / last_month_count) * 100
                    ELSE (this_month_count / last_month_count) * 100
                END
        END, 2
    ) AS percentage_change
from totals;

`)
            const totalItemSold = await query<TotalItemSold>(`WITH totals AS (
    SELECT
        coalesce(sum(cardinality(items)) FILTER (
            WHERE created_at >= date_trunc('month', CURRENT_DATE)
        ),0) AS this_month_total, 
        coalesce(sum(cardinality(items)) FILTER (
            WHERE created_at >= date_trunc('month', CURRENT_DATE) - interval '1 month'
                AND created_at < date_trunc('month', CURRENT_DATE)
        ), 0) AS last_month_total
    FROM opr.transactions
)
SELECT 
    this_month_total,
    last_month_total,
    ROUND(
        CASE 
            WHEN last_month_total = 0 THEN
                CASE 
                    WHEN this_month_total = 0 THEN 0
                    ELSE this_month_total * 100
                END
            else
            CASE
            WHEN this_month_total = 0 THEN
                (1 / last_month_total) * 100
                    ELSE (this_month_total / last_month_total) * 100
                END
        END, 2
    ) AS percentage_change
from totals;
`)
            const bestSellerItem = await query<BestSellerItem>(`WITH all_items AS (
    SELECT unnest(items) AS item
    FROM opr.transactions 
    WHERE created_at >= date_trunc('month', CURRENT_DATE)
),
parsed_items AS (
    SELECT 
        item->>'product' AS product,
        (item->>'peace')::int AS qty
    FROM all_items
)
SELECT 
    product,
    SUM(qty) AS total_sales
FROM parsed_items
GROUP BY product
ORDER BY total_sales DESC
LIMIT 1;
                `)
            const dataChartDashboard = await query<ChartSalesSummary>(`
                WITH months AS (
    SELECT to_char(date_trunc('month', CURRENT_DATE) - interval '1 month' * n, 'YYYY-MM') AS month,
           date_trunc('month', CURRENT_DATE) - interval '1 month' * n AS month_start
    FROM generate_series(0, 5) AS n
),
sales_per_month AS (
    SELECT 
        to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
        SUM(COALESCE(array_length(items, 1), 0)) AS sales
    FROM opr.transactions
    WHERE created_at >= date_trunc('month', CURRENT_DATE) - interval '5 months'
    GROUP BY date_trunc('month', created_at)
)
SELECT jsonb_agg(to_jsonb(m) ORDER BY m.month) AS sales_summary
FROM (
    SELECT 
        months.month,
        COALESCE(s.sales, 0) AS sales
    FROM months
    LEFT JOIN sales_per_month s ON months.month = s.month
) AS m;
                `)
            const compareTotal = await query<CompareTotal>(`
WITH monthly_data AS (
    SELECT 
    COALESCE(SUM(CASE WHEN date_trunc('month', t.created_at) = date_trunc('month', CURRENT_DATE) THEN t.total_price END), 0) AS total_this_month,
    COALESCE(SUM(CASE WHEN date_trunc('month', t.created_at) = date_trunc('month', CURRENT_DATE - interval '1 month') THEN t.total_price END), 0) AS total_last_month,
    COALESCE(COUNT(CASE WHEN date_trunc('month', t.created_at) = date_trunc('month', CURRENT_DATE) THEN t.total_price END), 0) AS transaction_this_month,
    COALESCE(COUNT(CASE WHEN date_trunc('month', t.created_at) = date_trunc('month', CURRENT_DATE - interval '1 month') THEN t.total_price END), 0) AS transaction_last_month
    FROM opr.transactions t
    WHERE t.created_at >= date_trunc('month', CURRENT_DATE - interval '1 month')
)

SELECT jsonb_build_object(
    'this_month', to_char(date_trunc('month', CURRENT_DATE), 'Month'),
    'total_this_month', total_this_month,
    'last_month', to_char(date_trunc('month', CURRENT_DATE - interval '1 month'), 'Month'),
    'total_last_month', total_last_month,
    'transaction_this_month', transaction_this_month,
    'transaction_last_month', transaction_last_month,
    'total_high_this_month', total_this_month > total_last_month,
    'percentage_total', 
    CASE 
        WHEN total_last_month = 0 or total_this_month = 0 THEN '100%' 
        ELSE 
            case 
      		when total_this_month > total_last_month then CEIL((total_last_month::decimal / total_this_month) * 100)::int || '%'
      		else CEIL((total_this_month::decimal / total_last_month) * 100)::int || '%'
            end
            
    END,
    'transaction_high_this_month', transaction_this_month > transaction_last_month,
    'percentage_transaction', 
    CASE 
        WHEN transaction_last_month = 0 or transaction_this_month = 0 THEN '100%' 
        else 
            case
      		when transaction_this_month > transaction_last_month then CEIL((transaction_last_month::decimal / transaction_this_month) * 100)::int || '%'
      		else CEIL((transaction_this_month::decimal / transaction_last_month) * 100)::int || '%'	
            end
        
    END
) AS monthly_summary
FROM monthly_data;
`)
            const bestSellerProductThisYear = await query<BestSellerProductThisYear>(`
                WITH all_items AS (
    SELECT unnest(t.items) AS item
    FROM opr.transactions t 
    WHERE t.created_at >= date_trunc('year', CURRENT_DATE)
),
parsed_items AS (
    SELECT 
        item->>'product' AS product,
        (item->>'price')::numeric AS price,
        (item->>'peace')::int AS qty
    FROM all_items
),
aggregated_items AS (
    SELECT 
        product,
        SUM(price * qty) AS total
    FROM parsed_items
    GROUP BY product
),
joined_with_products AS (
    SELECT 
        ai.product,
        ai.total,
        p.image
    FROM aggregated_items ai
    LEFT JOIN opr.products p ON p.product = ai.product
)

SELECT jsonb_agg(to_jsonb(row_data)) AS top_products
FROM (
    SELECT 
        ROW_NUMBER() OVER (ORDER BY total DESC) AS number,
        product,
        total,
        image
    FROM joined_with_products
    ORDER BY total DESC
    LIMIT 6
) AS row_data;
`)
            const last6Transaction = await query<Last6Transaction>(`
WITH latest_transactions AS (
    SELECT id, created_at::date AS date, items, total_price , buyer_from 
    FROM opr.transactions
    ORDER BY created_at DESC
    LIMIT 6
),
flattened AS (
    SELECT 
        lt.id,
        lt.date,
        item->>'product' AS product,
        lt.total_price,
        lt.buyer_from
    FROM latest_transactions lt,
        unnest(lt.items) AS item
),
grouped AS (
    SELECT 
        id,
        date,
        array_agg(product) AS products,
        MAX(total_price) AS total,
        buyer_from
    FROM flattened
    GROUP BY id, date, buyer_from
)
SELECT jsonb_agg(to_jsonb(t2) ORDER BY t2.date DESC) AS recent_transactions
FROM grouped t2;

`)

        const transactionFromWebsite = await query<transactionFW>(`
            WITH counts AS (
    SELECT
        COUNT(*) FILTER (
            WHERE buyer_from = 'website' 
            AND created_at >= date_trunc('month', CURRENT_DATE)
        ) AS this_month_count,

        COUNT(*) FILTER (
            WHERE buyer_from = 'website'
            AND created_at >= date_trunc('month', CURRENT_DATE) - interval '1 month'
            AND created_at < date_trunc('month', CURRENT_DATE)
        ) AS last_month_count
    FROM opr.transactions
)
SELECT 
    this_month_count,
    last_month_count,
    ROUND(
        CASE 
            WHEN last_month_count = 0 THEN
                CASE 
                    WHEN this_month_count = 0 THEN 0
                    ELSE this_month_count * 100
                END
            ELSE (this_month_count::numeric / last_month_count) * 100
        END, 2
    ) AS percentage_change
FROM counts;
`)
        const dataSend = {
            month: monthName,
            totalRevenue: findTotalRevenue[0] ?  findTotalRevenue[0] : {
                this_month_total: 0,
                last_month_total: 0,
                percentage_change: 0
            },
            totalTransaction: totalTransaction[0] ? totalTransaction[0] : {
                this_month_count: 0,
                last_month_count: 0,
                percentage_change: 0,
            },
            totalItemSold: totalItemSold[0] ? totalItemSold[0] :  {
                this_month_total:  0,
                last_month_total:  0,
                percentage_change:  0,
            },
            bestSellerItem: bestSellerItem[0] ? bestSellerItem[0] : {
                product: "",
                total_sales: 0
            },
            dataChartDashboard: dataChartDashboard[0].sales_summary ? dataChartDashboard[0].sales_summary :{
                month: "",
                sales: 0
            },
            compareTotal: compareTotal[0].monthly_summary ? compareTotal[0].monthly_summary  : {
                this_month: "",
                total_this_month: 0,
                transaction_this_month: 0,
                last_month: "",
                total_last_month: 0,
                transaction_last_month: 0,
                total_high_this_month : true,
                percentage_total : "",
                transaction_high_this_month: true,
                percentage_transaction: ""
            },
            last6Transaction: last6Transaction[0].recent_transactions ? last6Transaction[0].recent_transactions : [],
            bestSellerProductThisYear: bestSellerProductThisYear[0].top_products ? bestSellerProductThisYear[0].top_products : [],
            transactionFromWebsite: transactionFromWebsite[0] ? transactionFromWebsite[0] : {
                this_month_count: 0,
                last_month_count: 0,
                percentage_change: 0,
            }
        }

        return NextResponse.json({status: "00", message: "Get Data Succesfully", data:dataSend}, {status: 200})
    } catch(err:any){
        console.log(err);
        return NextResponse.json({status: "1001", message: "Failed to get Data", data:{message: err.message}}, {status: 200})
    }
}