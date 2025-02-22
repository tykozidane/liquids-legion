import React, { useState , FormEvent} from "react";
import {
  Table,
  TableBody,
  //   TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
// import { Button } from "@/components/ui/button"
export type TypeDataColumn = {
  column: number;
  title: string;
  type: "text" | "boolean" | "image" | "action";
  listAction?: {
    title: string;
    icon: React.ReactNode;
    action: any;
    type: "text" | "icon" | "both";
  }[];
  classname?: string;
};
interface ProductList {
  id:string
  product: string;
  image: string;
  merek: string;
  stock: number;
  price: number;
  created_at: string;
}
function TableComp({ dataColumn, dataRow, titleIn, loading, countUpdate, setCountUpdate, session }: any) {
  const [openEdit, setOpenEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState<ProductList | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false)

  console.log("dataColumn", dataRow);
  const dataCol = dataColumn;
  // dataCol.sort((a: TypeDataColumn, b: TypeDataColumn)=> a.column - b.column)

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    console.log("start", dataEdit)
    event.preventDefault()
      setLoadingUpdate(true)
      try {
        const formData = new FormData(event.currentTarget)
        console.log("formData", formData.get("product"))
        const response = await fetch('/api/v1/products/update-product', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + session.session.user.token,
          },
          body: JSON.stringify({
            userId: session.session.user.userId,
            productId: dataEdit?.id,
            dataUpdate: `product= '${formData.get("product")}' , merek= '${formData.get("merek")}' , stock= '${formData.get("stock")}' , price= '${formData.get("price")}'`
          }),
        })
   
        if (!response.ok) {
          throw new Error('Failed to submit the data. Please try again.')
        }
   
        // Handle response if necessary
        const data = await response.json()
        console.log("data", data)
        setCountUpdate(countUpdate + 1)
        setOpenEdit(false)
      } catch (error: any) {
        // Capture the error message to display to the user
        // setError(error.message)
        console.log(error)
      } finally {
        setLoadingUpdate(false)
      }
 
  }

  return (
    <div className="border rounded-lg px-3">
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
        <form onSubmit={handleUpdate} className='w-full'>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name 
              </Label>
              <Input id="product" name='product' type="text" defaultValue={dataEdit?.product}  className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Merek
              </Label>
              <Input id="merek" name='merek' type="text" defaultValue={dataEdit?.merek} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Stock
              </Label>
              <Input id="stock" name='stock' type="number" defaultValue={dataEdit?.stock} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Price
              </Label>
              <Input id="price" name='price' type="number" defaultValue={dataEdit?.price} className="col-span-3" />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loadingUpdate} className='w-full'>
                      {loadingUpdate ? 'Loading...' : 'Save Update'}
                    </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow key={titleIn}>
            {dataCol.map((item: any) => (
              <>
                <TableHead className=" uppercase" key={item.title}>
                  {" "}
                  {item.title}{" "}
                </TableHead>
              </>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRow ? (
            <>
              {dataRow.map((item: any, index: any) => (
                <>
                  <TableRow key={index}>
                    {dataCol.map((head: any) => (
                      <>
                        <TableCell key={head.title}>
                          {head.type == "text" && <>{item[head.title]}</>}
                          {head.type == "boolean" && <></>}
                          {head.type == "image" && (
                            <>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Image
                                    src={"/images/" + item[head.title]}
                                    alt="imageProduct"
                                    width={50}
                                    height={50}
                                  />
                                </DialogTrigger>
                                <DialogContent className="w-[60dvh] h-[60dvh]">
                                  <DialogHeader>
                                    <DialogTitle> {item[titleIn]} </DialogTitle>
                                  </DialogHeader>
                                  <div className="w-[50dvh] h-[50dvh] flex items-center justify-center">
                                    <Image
                                      src={"/images/" + item[head.title]}
                                      alt="imageProduct"
                                      fill={true}
                                      className="w-full h-full max-w-[50dvh] max-h-[50dvh] mt-10 mx-auto"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                          {head.type == "action" && (
                            <>
                              <Button
                                size={"sm"}
                                onClick={() => {
                                  setDataEdit(item);
                                  setOpenEdit(true);
                                }}
                              >
                                <SquarePen width={10} height={10} /> Edit
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </>
                    ))}
                  </TableRow>
                </>
              ))}
            </>
          ) : (
            <>
              <TableRow key={"noresult"}>
                <TableCell colSpan={dataCol.length} className=" h-48 text-center relative">
                  {loading && (
                    <>
                      <div className="absolute w-full h-full flex justify-center items-center top-0 left-0">
                        <div className="rounded-md h-20 w-20 border-4 border-t-4 border-blue-500 animate-spin"></div>
                      </div>
                    </>
                  )}
                  No results.
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableComp;
