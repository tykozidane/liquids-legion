"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Products = {
  id: string
  product: string
  image: string
  merek: string
  status: string
  stock: number
  price: number
}

export const columns: ColumnDef<Products>[] = [
    {
        accessorKey: "image",
        header: "Image",
      },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "merek",
    header: "Merek",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
]
