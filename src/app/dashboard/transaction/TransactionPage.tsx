"use client";
import React, { useEffect, useState } from "react";

// import { DataTable } from './data-table'
// import { columns } from './columns'
import {
  DropdownMenu,
  // DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { File, ListFilter, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import TableComponent, { TypeDataColumn } from "@/components/TableComponent";
import Link from "next/link";
import { DatePickerComp } from "./DatePickerComp";
import { subMonths } from "date-fns";
import { DateRange } from "react-day-picker"
// import { Label } from "@/components/ui/label"

const dataColumn: TypeDataColumn[] = [
  {
    column: 1,
    header: "Date",
    title: "date",
    type: "timestampT",
  },
  {
    column: 2,
    header: "Items",
    title: "items",
    type: "items",
    itemList: [{title: "image", type:"image", className: "col-span-1 flex justify-start items-center"}, {title: "product", type: "text", className: "col-span-3 flex justify-start items-center"},{title: "price", type: "price", className: "col-span-1 flex justify-end  items-center"}],
    classItem: "grid grid-cols-5 w-full min-w-80 content-center"
  },
  {
    column: 3,
    header: "Price",
    title: "price",
    type: "text",
  },
  {
    column: 4,
    header: "Deliv",
    title: "delivery_price",
    type: "text",
  },
  {
    column: 5,
    header: "Total",
    title: "total_price",
    type: "text",
  },
  {
    column: 6,
    header: "Payment",
    title: "payment_type",
    type: "text",
  },
  {
    column: 7,
    header: "From",
    title: "buyer_from",
    type: "text",
  },
  {
    column: 8,
    header: "Status",
    title: "status",
    type: "text",
  },
  {
    column: 9,
    header: "Address",
    title: "address",
    type: "text",
  },
];

interface TransactionList {
  id: string;
  date: string;
  items: {
    id: string;
    image: string;
    product: string;
    price: number;
    peace: number;
  }[];
  price: number;
  delivery_price: number;
  total_price: number;
  payment_type: string;
  buyer_from: string;
  address: string;
  status: string;
  created_at: string;
}

function TransactionPage(session: any) {
  // console.log("Session", session.session.user)
  const [dataFetch, setDataFetch] = useState<TransactionList[] | null>(null);
  const [dataTable, setDataTable] = useState<TransactionList[] | null>(null);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to:  new Date(),
  })  
  useEffect(() => {
    const getData = async (session: any) => {
      setLoading(true);
      fetch(`${process.env.API_URL}/api/v1/transaction/get-all-transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + session.user.token,
        },
        body: JSON.stringify({
          userId: session.user.userId,
          from: date?.from || '2000-01-01 00:00:00',
          to: date?.to|| date?.from || '2000-01-01 23:59:59',
        }),
      })
        .then((item: any) => item.json())
        .then((response: any) => {
          console.log("Res", response);
          if(response.status !== '00'){
            setDataTable([]);
          setDataFetch([]);
            alert(response.message);
          } else {
            const datanya = response.data;
          console.log("Datanya", datanya);
          setDataTable(datanya);
          setDataFetch(datanya);
          }
          
          setLoading(true);
        });
    };
   
    getData(session.session);
  }, [ session, date]);

  const handleSearch = (e: string) => {
    console.log("Search", e);
    if (Array.isArray(dataFetch)) {
      const search = RegExp(`.*${e.toLowerCase().split("").join(".*")}.*`);
      const newData = dataFetch
        .filter((item: any) => item.product.toLowerCase().match(search))
        .map((item: any) => {
          return item;
        });
      console.log("NewData", newData);
      setDataTable(newData);
    }
  };
  useEffect(() => {
    if (dataTable && dataTable?.length > 0) {
      if (sort == "newest") {
        const sortedData = [...dataTable].sort(function (a, b) {
          return new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf();
        });
        setDataTable(sortedData);
      }  else if (sort == "pricy") {
        console.log("Sort", sort);
        const sortedData = [...dataTable].sort((a, b) => b.price - a.price);
        setDataTable(sortedData);
      }
    }
  }, [sort]);

  return (
    <main className="flex-col items-start p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex justify-between items-center mb-3">
        <div className="flex ">
        <DatePickerComp date={date} setDate={setDate}/>
          <Input
            type="text"
            placeholder="Search"
            className=" w-52 lg:w-72 ml-3"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        </div>
        <div className=" flex items-center gap-2 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pricy">Most Big Purchase</DropdownMenuRadioItem>
                {/* <DropdownMenuRadioItem value="stock">Most </DropdownMenuRadioItem> */}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1" disabled>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
                <Link href={'/dashboard/transaction/input-transaction'} className={buttonVariants({ variant: "default", size:"sm" })}><PlusCircle className="h-3.5 w-3.5" />Input Transaction</Link>
        </div>
      </div>
            <TableComponent dataColumn={dataColumn} dataRow={dataTable} titleIn="Transaction" loading={loading} />
      
    </main>
  );
}

export default TransactionPage;
