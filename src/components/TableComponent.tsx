import React from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { format } from "date-fns";
// import { Button } from "@/components/ui/button"
export type TypeDataColumn = {
  column: number;
  title: string;
  header: string;
  type: "text" | "boolean" | "image" | "action" | "array" | "items" | "timestampT";
  itemList? : {
    title: string;
    type: string;
    className: string;
  }[];
  classItem? : string;
  listAction?: {
    title: string;
    icon: React.ReactNode;
    action: any;
    type: "text" | "icon" | "both";
  }[];
  classname?: string;
};
function TableComponent({ dataColumn, dataRow, titleIn, loading, setDataEdit, setOpenEdit }: any) {

  console.log("dataColumn", dataRow);
  const dataCol = dataColumn;
  // dataCol.sort((a: TypeDataColumn, b: TypeDataColumn)=> a.column - b.column)
  // const formatTimestamp = (timestamp:any) => {
  //   const date = new Date(timestamp);
  //   return date.toLocaleString();
  // }

  return (
    <div className="border rounded-lg px-3">
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow key={titleIn}>
            {dataCol.map((item: any) => (
              <>
                <TableHead className=" uppercase" key={item.title}>
                  {" "}
                  {item.header}{" "}
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
                  <TableRow key={index} className="">
                    {dataCol.map((head: any) => (
                      <>
                        <TableCell key={head.title}>
                          {head.type == "text" && <>{item[head.title]}</>}
                          {head.type == "boolean" && <></>}
                          {head.type == "timestampT" && <> {format(new Date(item[head.title]), "yyyy-MM-dd HH:mm:ss")} </>}
                          {head.type == "array" && <>
                            {item[head.title].toString()}
                          </>}
                          {head.type == "items" && <div className="flex flex-col">
                            {item[head.title].map((dataItems:any) =>(<>
                            <div className={head.classItem}>
                              {head.itemList.map((dataHead:any)=>(<>
                                <div className={dataHead.className}>
                                  {dataHead.type == "image" && <>
                                  <div className="separator-custom h-10 w-1"></div>
                                    <Image
                                      src={"/images/" + dataItems[dataHead.title]}
                                      alt="imageProduct"
                                      width={50}
                                      height={50}
                                    />
                                  </>}
                                  {dataHead.type == "text" && <>
                                    {dataItems[dataHead.title]}
                                  </>}
                                  {dataHead.type == "price" && <>
                                    {dataItems[dataHead.title]}
                          <div className="separator-custom h-10 ml-3"></div>
                                  </>}
                                </div>
                              </>))}
                            </div>
                            </>))}
                            
                          </div>}
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

export default TableComponent;
