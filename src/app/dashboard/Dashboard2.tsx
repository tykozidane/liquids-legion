"use client"
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  // TrendingUp,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// import { useRouter } from "next/navigation"
// import { ChartContainer } from "@/components/ui/chart"
// import { Bar, LabelList, XAxis, YAxis,BarChart } from "recharts"
import BarChartComp from "@/components/BarChartComp"
import { useEffect, useState } from "react"
import LoaderCircleRound from "@/components/loader/LoaderCircleRound"
// const chartDataExample = [
//   { date: "Monday", sales: 186 },
//   { date: "Tuesday", sales: 305 },
//   { date: "Wednesday", sales: 111 },
//   { date: "Thursday", sales: 73 },
//   { date: "Friday", sales: 219 },
//   { date: "Saturday", sales: 124 },
//   { date: "Sunday", sales: 186 },
// ]


type DataDashboard = {
  month : string
  totalRevenue: {
    this_month_total: number | 0;
    last_month_total: number | 0;
    percentage_change: number | 0;
  };
  totalTransaction: {
    this_month_count: number | 0;
    last_month_count: number | 0;
    percentage_change: number | 0;
  };
  totalItemSold: {
    this_month_total: number | 0;
    last_month_total: number | 0;
    percentage_change: number | 0;
  };
  bestSellerItem: {
    product: string | "";
    total_sales: string | 0;
  };
  dataChartDashboard : {
    month: string | "";
    sales: string | ""
  }[];
  compareTotal : {
    last_month: string | "";
    this_month: string | "";
    total_last_month : number | 0;
    total_this_month: number | 0;
    transaction_last_month : number | 0;
    transaction_this_month : number | 0;
    total_high_this_month : boolean | true;
    percentage_total : string | "";
    transaction_high_this_month: boolean | true;
    percentage_transaction: string | "";
  }
  bestSellerProductThisYear: {
    total: number  | 0;
    number: number | 0;
    product: string | "";
    image:string | "";
  }[]
  transactionFromWebsite: {
    this_month_count: number | 0;
    last_month_count: number | 0;
    percentage_change: number | 0;
  }
  last6Transaction : {
    date:string | "";
    total: number  | 0;
    products: [];
    buyer_from: string | "";
  }[]
}

const emptyDataDashboard :DataDashboard = {
  month : "",
  totalRevenue: {
    this_month_total:  0,
    last_month_total:  0,
    percentage_change:  0
  },
  totalTransaction: {
    this_month_count:  0,
    last_month_count:  0,
    percentage_change:  0,
  },
  totalItemSold: {
    this_month_total:  0,
    last_month_total:  0,
    percentage_change:  0,
  },
  bestSellerItem: {
    product:  "",
    total_sales:  0,
  },
  dataChartDashboard : [{
    month:  "",
    sales:  ""
  }],
  compareTotal : {
    last_month:  "",
    this_month:  "",
    total_last_month :  0,
    total_this_month:  0,
    transaction_last_month :  0,
    transaction_this_month :  0,
    total_high_this_month :  true,
    percentage_total :  "",
    transaction_high_this_month:  true,
    percentage_transaction:  "",
  },
  bestSellerProductThisYear: [{
    total:  0,
    number:  0,
    product:  "",
    image: "",
  }],
  transactionFromWebsite: {
    this_month_count:  0,
    last_month_count:  0,
    percentage_change:  0,
  },
  last6Transaction : [{
    date: "",
    total:  0,
    products: [],
    buyer_from:  "",
  }]
}

export default function Dashboard2({session}:any) {
  const [loading, setLoading] = useState(true);
  const [dataDashboard, setDataDashboard] = useState<DataDashboard | null>(null)
  const [widthReady, setWidthReady] = useState(false);
  // const router = useRouter()
  // if (!session?.user) {
    // console.log("session",session)
  //   router.push('/login')
  // }
  useEffect(()=> {
    const getData = async (session:any) => {
      setLoading(true);
      // console.log("BaseUrl", process.env.API_URL)
      fetch(`${process.env.API_URL}/api/v1/dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + session.user.token,
        },
        body: JSON.stringify({
          userId: session.user.userId
        }),
      }).then((item: any) => item.json())
      .then((response: any) => {
        // console.log("RES", response)
        if(response.status !== "00"){
          alert(response.message);
          setDataDashboard(emptyDataDashboard)
        } else {
          const datanya = response.data;
          setDataDashboard(datanya)
          setLoading(false)
          // console.log("math", datanya!.compareTotal)
        }
      })
    }
    getData(session)
  },[])
  // console.log("getdata", session)
  useEffect(() => {
    // Trigger width transition after component mounts
    const timeout = setTimeout(() => setWidthReady(true), 300); // slight delay to allow initial render
    return () => clearTimeout(timeout);
  }, [loading]);
  // const user = session?.user
  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {
          loading === false && dataDashboard != null ? (<>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp. {dataDashboard.totalRevenue.this_month_total.toLocaleString()} </div>
              <p className="text-xs text-muted-foreground">
                {dataDashboard.totalRevenue.percentage_change}% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Transaction
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {dataDashboard.totalTransaction.this_month_count} </div>
              <p className="text-xs text-muted-foreground">
                {dataDashboard.totalTransaction.percentage_change}% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Item</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {dataDashboard.totalItemSold.this_month_total} </div>
              <p className="text-xs text-muted-foreground">
                {dataDashboard.totalItemSold.percentage_change}% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Website Order</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> {dataDashboard.transactionFromWebsite.this_month_count} </div>
              <p className="text-xs text-muted-foreground">
                {dataDashboard.transactionFromWebsite.percentage_change}% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4 lg:grid-rows-2">
        <Card className="lg:mx-w-md row-span-2 col-span-2" x-chunk="chart-01-chunk-0">
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComp chartData={dataDashboard.dataChartDashboard} />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total Transaction for the last 6 months
              </div>
            </CardFooter>
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Total This Month</CardTitle>
              <CardDescription>
                Total that you earn this {dataDashboard.compareTotal.this_month}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {dataDashboard.compareTotal.total_this_month.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                <span className="text-sm font-normal text-muted-foreground">
                  Rupiah
                </span>
              </div>
                <div 
              style={{width: widthReady ? dataDashboard.compareTotal.total_high_this_month ? '100%' : dataDashboard.compareTotal.percentage_total : '80px'}}
              className={`bg-primary text-xs text-white flex items-center pl-2 transition-all delay-200 duration-1000 ease-in-out rounded-md h-[32px] min-w-20`}>
                This Month
                </div>
            </div>
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
              {dataDashboard.compareTotal.total_last_month.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                <span className="text-sm font-normal text-muted-foreground">
                  Rupiah
                </span>
              </div>
              <div 
              style={{width: widthReady ? dataDashboard.compareTotal.total_high_this_month === false ? '100%' : dataDashboard.compareTotal.percentage_total : '80px'}}
              className={`bg-muted text-xs text-gray-500 flex items-center pl-2 transition-all delay-100 duration-1000 ease-in-out rounded-md h-[32px] min-w-20`}>
                This Month
                </div>
            </div>
          </CardContent>
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Transaction This Month</CardTitle>
              <CardDescription>
                Total Transaction this {dataDashboard.compareTotal.this_month}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {dataDashboard.compareTotal.transaction_this_month}
                <span className="text-sm font-normal text-muted-foreground">
                  Transaction
                </span>
              </div>
              <div 
              style={{width: widthReady ? dataDashboard.compareTotal.transaction_high_this_month ? '100%' : dataDashboard.compareTotal.percentage_transaction : '80px'}}
              className={`bg-primary text-xs text-white flex items-center pl-2 transition-all delay-200 duration-1000 ease-in-out rounded-md h-[32px] min-w-20`}>
                This Month
                </div>
            </div>
            <div className="grid auto-rows-min gap-2">
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {dataDashboard.compareTotal.transaction_last_month}
                <span className="text-sm font-normal text-muted-foreground">
                  Transaction
                </span>
              </div>
              <div 
              style={{width: widthReady ? dataDashboard.compareTotal.transaction_high_this_month === false ? '100%' : dataDashboard.compareTotal.percentage_transaction : '80px'}}
              className={`bg-muted text-xs text-slate-500 flex items-center pl-2 transition-all duration-1000 ease-in-out rounded-md h-[32px] min-w-20 `}>
                This Month
                </div>
            </div>
          </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card
            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/transaction">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="">
                      Item
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Status
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Date
                    </TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataDashboard.last6Transaction.map((item, index:any) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium"> {item.date} </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {item.buyer_from}
                          </div>
                        </TableCell>
                        <TableCell className="">
                          {item.products.join(" | ")}
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                          2023-06-23
                        </TableCell>
                        <TableCell className="text-right"> {item.total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              {dataDashboard.bestSellerProductThisYear.map((item, index:any) => {
                return (
                  <div className="flex items-center gap-4" key={index}>
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={process.env.PUBLIC_SRC+"/images/" +item.image} alt="Avatar" />
                      <AvatarFallback className="uppercase"> {item.product.split(" ")[0][0] + item.product.split(" ")[1][0]} </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {item.product}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.number}
                      </p>
                    </div>
                    <div className="ml-auto font-medium"> {item.total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
          </>) : (<>
            <div className="  z-50 w-full h-full flex justify-center items-center">
                    <LoaderCircleRound color={'#000000'} />
                </div>
          </>)
        }
        
      </main>
  )
}
