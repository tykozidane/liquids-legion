'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import Image from "next/image";
import React, { FormEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
function AddFinance({session, countUpdate, setCountUpdate, setOpenAdd}:any) {
    const [file, setFile] = useState<File>()
    const [imageSave, setImageSave] = useState("")
    // const [dataProduct, setDataProduct] = useState<Product>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [error, setError] = useState<string | null>(null)
    const [financeType, setFinanceType] = useState("debit");
    const [fromWhere, setFromWhere] = useState("kas");
  
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!file) return
  
      try {
        const data = new FormData()
        data.append('file', file)
  
        fetch('/api/v1/upload/finance', {
          method: 'POST',
          body: data
        }) .then(response => response.json())
        .then(data => setImageSave(data.data.filename))
        .catch(error => console.error("error",error));

        // const dataResponse = res.json();
        // console.log("Response",dataResponse)
        // if(dataResponse.status = "00"){
        //     setImageSave(dataResponse.data.filename)
        // }
        


        // handle the error
        // if (!res.ok) throw new Error(await res.text())
      } catch (e: any) {
        // Handle errors here
        console.error(e)
      }
    }
    console.log(session)
    async function saveSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setIsLoading(true)
      // setError(null) // Clear previous errors when a new request starts

      try {
        const formData = new FormData(event.currentTarget)
        console.log("formData", formData.get("product"))
        const response = await fetch('/api/v1/finance/input-data', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + session.user.token,
          },
          body: JSON.stringify({
            userId: session.user.userId,
            dataFinance: {
              date: formData.get("date"),
              type: financeType,
              description: formData.get("description"),
              amount: formData.get("amount"),
              from: fromWhere,
              recipt: imageSave}
          }),
        })
   
        if (!response.ok) {
          throw new Error('Failed to submit the data. Please try again.')
        }
   
        // Handle response if necessary
        const data = await response.json()
        console.log("data", data)
        setCountUpdate(countUpdate + 1)
        setOpenAdd(false)
      } catch (error: any) {
        // Capture the error message to display to the user
        // setError(error.message)
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='w-[22dvh] h-[22dvh] rounded-lg bg-slate-500 mb-3 overflow-hidden'>
        <div className='w-full h-full max-w-[20dvh] max-h-[20dvh]'>
            {imageSave != "" && (
            <Image 
                      src={"/images/"+imageSave}
                      alt="imageRecipt"
                      fill={true}
                      className="w-full h-full max-w-[20dvh] max-h-[20dvh] mt-16 mx-auto rounded-lg object-contain" 
                      />
       )} 
        </div>
        </div>
        <form onSubmit={onSubmit} className='flex mb-5'>
            <Input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files?.[0])}
                className='rounded-lg mr-1'
            />
            <Button type="submit" className=' rounded-lg px-3 '>Upload Recipt </Button>
        </form>
        <form onSubmit={saveSubmit} className='w-full'>
            <div className="grid w-full items-center gap-1.5 mb-3">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="datetime-local" className="w-full" />
                      </div>
        <div className="grid w-full  items-center gap-1.5 mb-3">
            <Label htmlFor="type">Type</Label>
            {/* <Input id="payment_type" name="payment_type" type="number" placeholder="110.000" /> */}
            <Select defaultValue={financeType} onValueChange={(val) => setFinanceType(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type Data" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="kredit">Kredit</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5 mb-3">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name='description' type="text" placeholder='Restock'/>
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3"> 
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name='amount' type="number" placeholder='100000'/>
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
            <Label htmlFor="from">From Where</Label>
            {/* <Input id="payment_type" name="payment_type" type="number" placeholder="110.000" /> */}
            <Select defaultValue={fromWhere} onValueChange={(val) => setFromWhere(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select From Where" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="kas">KAS</SelectItem>
                  <SelectItem value="tyko">Tyko</SelectItem>
                  <SelectItem value="bachul">Bachul</SelectItem>
                  <SelectItem value="eksternal">Eksternal</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {imageSave == "" ? (<>
            <Button type="submit" disabled className='w-full'>
          Submit
        </Button>
          </>) : (<>
            <Button type="submit" disabled={isLoading} className='w-full'>
          {isLoading ? 'Loading...' : 'Submit'}
        </Button>
          </>)}
          
        </form>
        
    </div>
  )
}

export default AddFinance