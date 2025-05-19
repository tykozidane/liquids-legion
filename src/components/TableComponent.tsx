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
import LoaderCircleRound from "./loader/LoaderCircleRound";
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
            {dataCol.map((item: any, index:any) => (
                <TableHead className=" uppercase" key={index}>
                  {" "}
                  {item.header}{" "}
                </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataRow ? (
            <>
              {dataRow.map((item: any, index: any) => (
                  <TableRow key={index} className="">
                    {dataCol.map((head: any) => (
                        <TableCell key={head.title}>
                          {head.type == "text" && <>{item[head.title]}</>}
                          {head.type == "boolean" && <></>}
                          {head.type == "timestampT" && <> {format(new Date(item[head.title]), "yyyy-MM-dd HH:mm:ss")} </>}
                          {head.type == "array" && <>
                            {item[head.title].toString()}
                          </>}
                          {head.type == "items" && <div className="flex flex-col">
                            {item[head.title].map((dataItems:any, index:any) =>(
                            <div className={head.classItem} key={index}>
                              {head.itemList.map((dataHead:any, index2:any)=>(
                                <div className={dataHead.className} key={index2}>
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
                                  {dataHead.type == "peace" && <>
                                  x {dataItems[dataHead.title]}
                                  </>}
                                  {dataHead.type == "price" && <>
                                    {dataItems[dataHead.title]}
                          <div className="separator-custom h-10 ml-3"></div>
                                  </>}
                                </div>
                              ))}
                            </div>))}
                            
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
                    ))}
                    
                  </TableRow>
                  
              ))}
            </>
          ) : (
            <>
              <TableRow key={"noresult"}>
                <TableCell colSpan={dataCol.length} className=" h-48 text-center relative">
                  {loading && (
                    <>
                      <div className="  z-50 w-full h-full flex justify-center items-center">
                                          <LoaderCircleRound color={'#000000'} />
                                      </div>
                    </>
                  )}
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
