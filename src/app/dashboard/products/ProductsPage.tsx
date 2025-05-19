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
import { Button } from "@/components/ui/button";
import { File, ListFilter, PlusCircle } from "lucide-react";
import TableComp, { TypeDataColumn } from "@/app/dashboard/products/TableProducts";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  // DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label"
import AddProduct from "./AddProduct";

const dataColumn: TypeDataColumn[] = [
  {
    column: 1,
    title: "image",
    type: "image",
  },
  {
    column: 2,
    title: "product",
    type: "text",
  },
  {
    column: 3,
    title: "merek",
    type: "text",
  },
  {
    column: 4,
    title: "stock",
    type: "text",
  },
  {
    column: 5,
    title: "price",
    type: "text",
  },
  {
    column: 6,
    title: "edit",
    type: "action",
  },
];

interface ProductList {
  id: string;
  product: string;
  image: string;
  merek: string;
  stock: number;
  price: number;
  created_at: string;
}
function ProductsPage(session: any) {
  // console.log("Session", session.session.user)
  const [dataFetch, setDataFetch] = useState<ProductList[] | null>(null);
  const [dataTable, setDataTable] = useState<ProductList[] | null>(null);
  const [countUpdate, setCountUpdate] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async (session: any) => {
      setLoading(true);
      fetch(`${process.env.API_URL}/api/v1/products/get-all-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + session.user.token,
        },
        body: JSON.stringify({
          userId: session.user.userId,
        }),
      })
        .then((item: any) => item.json())
        .then((response: any) => {
          // console.log("Res", response);
          const datanya = response.data;
          // console.log("Datanya", datanya);
          setDataTable(datanya);
          setDataFetch(datanya);
          setLoading(true);
        });
    };
    getData(session.session);
  }, [countUpdate, session]);

  const handleSearch = (e: string) => {
    // console.log("Search", e);
    if (Array.isArray(dataFetch)) {
      const search = RegExp(`.*${e.toLowerCase().split("").join(".*")}.*`);
      const newData = dataFetch
        .filter((item: any) => item.product.toLowerCase().match(search))
        .map((item: any) => {
          return item;
        });
      // console.log("NewData", newData);
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
      } else if (sort == "stock") {
        // console.log("Sort", sort);
        const sortedData = [...dataTable].sort((a, b) => b.stock - a.stock);
        setDataTable(sortedData);
      } else if (sort == "pricy") {
        // console.log("Sort", sort);
        const sortedData = [...dataTable].sort((a, b) => b.price - a.price);
        setDataTable(sortedData);
      }
    }
  }, [sort]);

  return (
    <main className="flex-col items-start p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex justify-between items-center">
        <div className="">
          <Input
            type="text"
            placeholder="Search"
            className=" w-72"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        </div>
        <div className="ml-auto flex items-center gap-2 mb-7">
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
                <DropdownMenuRadioItem value="pricy">Most Expensive</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="stock">Most Stock</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1" disabled>
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
              </DialogHeader>
              <AddProduct
                session={session.session}
                setCountUpdate={setCountUpdate}
                countUpdate={countUpdate}
                setOpenAdd={setOpenAdd}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* <DataTable columns={columns} data={getDataFetch.data}/> */}
      <TableComp
        dataColumn={dataColumn}
        dataRow={dataTable}
        titleIn="product"
        loading={loading}
        session={session}
        countUpdate={countUpdate}
        setCountUpdate={setCountUpdate}
      />
    </main>
  );
}

export default ProductsPage;
