"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { FormEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  // CommandSeparator,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2, Minus, Plus } from "lucide-react";
import { redirect } from "next/navigation";

interface Items {
  id: string;
  image: string;
  product: string;
  price: number;
  peace: number;
}
interface ProductList {
  id: string;
  product: string;
  image: string;
  merek: string;
  stock: number;
  price: number;
  created_at: string;
}
function AddTransaction({ session }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  // const [value, setValue] = useState("");
  const [countUpdate, setCountUpdate] = useState(0);
  const [priceAllItem, setPriceAllItem] = useState(0);
  const [priceDeliv, setPriceDeliv] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentType, setPaymentType] = useState("cash");
  const [statusTrans, setStatusTrans] = useState("success");
  const [buyerFrom, setBuyerFrom] = useState("");
  const [itemList, setItemList] = useState<Items[]>([]);
  const [dataProduct, setDataProduct] = useState<ProductList[]>();
  // console.log("SEssion", session.user);
  async function saveSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      // console.log("formData", formData.get("product"));
      const response = await fetch("/api/v1/transaction/input-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + session.user.token,
        },
        body: JSON.stringify({
          userId: session.user.userId,
          dataTransaction: {
            date: formData.get("date"),
            items: itemList,
            price: priceAllItem,
            delivery_price: priceDeliv,
            total_price: totalPrice,
            payment_type: paymentType,
            buyer_from: buyerFrom,
            address: formData.get("address"),
            status: statusTrans,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      // Handle response if necessary
      const _data = await response.json();
      // console.log("data", data);
    } catch (_error: any) {
      // Capture the error message to display to the user
      // setError(error.message)
      // console.log(error);
    } finally {
      setIsLoading(false);
      redirect("/dashboard/transaction");
    }
  }

  useEffect(() => {
    const getProduct = async (session: any) => {
      fetch(`${process.env.API_URL}/api/v1/products/get-all-ready-products`, {
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
          // console.log("Res product", response);
          const datanya = response.data;
          // console.log("Data Productnya", datanya);
          setDataProduct(datanya);
        });
    };
    getProduct(session);
  }, [session]);
  const buttonPeace = ({ product, type }: any) => {
    if (type === "minus") {
      if (itemList.find((item: any) => item.product === product)?.peace === 1) {
        setItemList((oldValues) => {
          return oldValues.filter((prod) => prod.product !== product);
        });
      } else {
        setItemList(
          itemList.map((item: any) =>
            item.product === product ? { ...item, peace: item.peace - 1 } : item
          )
        );
      }
    } else if (type === "plus") {
      setItemList(
        itemList.map((item: any) =>
          item.product === product ? { ...item, peace: item.peace + 1 } : item
        )
      );
    }
    setCountUpdate(countUpdate + 1);
  };
  useEffect(() => {
    let tempPrice = 0;
    itemList.forEach((item: any) => {
      tempPrice += item.price * item.peace;
    });
    setPriceAllItem(tempPrice);
    if (priceDeliv && priceDeliv >= 0) {
      setTotalPrice(tempPrice + priceDeliv);
    } else {
      setTotalPrice(tempPrice);
    }
    // console.log("Price", priceAllItem)
  }, [countUpdate]);
  return (
    <main className="flex-col items-start p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={saveSubmit} className="w-full">
          <div className="grid w-full items-center gap-1.5 mb-3">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="datetime-local" className="w-full" required  />
          </div>
          <div>
            <Label>Item</Label>
          </div>
          <div
            className="w-full flex flex-col items- justify-center my-2"
          >
            {itemList.map((item: Items, index:any) => (
                <div
                  className="flex items-center justify-between border px-2 py-1 rounded-lg"
                  key={"div" + index + item.product}
                >
                  <div>{item.product}</div>
                  <div className="flex items-center justify-center">
                    <Button
                      type="button"
                      className="h-8 w-8"
                      onClick={() => buttonPeace({ product: item.product, type: "minus" })}
                    >
                      <Minus />
                    </Button>
                    <Input
                    
                      id={item.product}
                      className="w-fit text-center mx-3"
                      name={"peace" + item.product}
                      type="number"
                      value={item.peace}
                      onChange={(e) => {
                        e.preventDefault();
                        const value = e.target.value;
                        setItemList(
                          itemList.map((product: any) =>
                            product.product === item.product
                              ? { ...product, peace: value }
                              : product
                          )
                        );
                        setCountUpdate(countUpdate + 1);
                      }}
                    />
                    <Button
                      type="button"
                      className="h-8 w-8"
                      onClick={() => buttonPeace({ product: item.product, type: "plus" })}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
            ))}
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {/* {value
            ? dataProduct!.find((framework) => framework.product === value)?.product
            : "Select Product..."} */}
                Select Product...
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." className="h-9 " />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {dataProduct &&
                      dataProduct.map((framework) => (
                        <CommandItem
                          key={framework.product}
                          value={framework.product}
                          onSelect={(currentValue) => {
                            if (
                              !itemList.find((product: any) => product.product === currentValue)
                            ) {
                              setItemList([
                                ...itemList,
                                {
                                  id: framework.id,
                                  image: framework.image,
                                  product: framework.product,
                                  price: framework.price,
                                  peace: 1,
                                },
                              ]);
                              setCountUpdate(countUpdate + 1);
                            }
                          }}
                        >
                          {framework.product}
                          <Check
                            className={cn(
                              "ml-auto",
                              itemList.find((product: any) => product.product === framework.product)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="grid w-full  items-center gap-1.5 mb-3 mt-5">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={priceAllItem}
              disabled
              className=" disabled:text-black disabled:opacity-100"
            />
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
            <Label htmlFor="delivery_price">Delivery Price</Label>
            <Input
              id="delivery_price"
              name="delivery_price"
              type="number"
              placeholder="0"
              onChange={(e) => {
                setPriceDeliv(e.target.valueAsNumber);
                setCountUpdate(countUpdate + 1);
              }}
            />
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
            <Label htmlFor="total_price">Total Price</Label>
            <Input
              id="total_price"
              name="total_price"
              type="number"
              value={totalPrice}
              disabled
              className=" disabled:text-black disabled:opacity-100"
            />
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
            <Label htmlFor="payment_type">Payment Type</Label>
            {/* <Input id="payment_type" name="payment_type" type="number" placeholder="110.000" /> */}
            <Select defaultValue={paymentType} onValueChange={(val) => setPaymentType(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="qris">Qris</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
            <Label htmlFor="buyer_from">Buyer From</Label>
            <Select onValueChange={(val) => setBuyerFrom(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Get Transaction From " />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="tokopedia">Tokopedia</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" type="text" placeholder="Jln. Raya Bogor" />
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={statusTrans} onValueChange={(val) => setStatusTrans(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Get Transaction From " />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="sending">Sending</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default AddTransaction;
