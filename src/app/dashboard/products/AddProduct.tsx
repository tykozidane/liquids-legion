'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import Image from "next/image";
import React, { FormEvent, useState } from 'react'

function AddProduct({session, countUpdate, setCountUpdate, setOpenAdd}:any) {
    const [file, setFile] = useState<File>()
    const [imageSave, setImageSave] = useState("")
    // const [dataProduct, setDataProduct] = useState<Product>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
  // const [error, setError] = useState<string | null>(null)
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!file) return
  
      try {
        const data = new FormData()
        data.append('file', file)
  
        fetch('/api/v1/upload', {
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
      } catch (_e: any) {
        // Handle errors here
        // console.error(e)
      }
    }
    // console.log(session)
    async function saveSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setIsLoading(true)
      // setError(null) // Clear previous errors when a new request starts

      try {
        const formData = new FormData(event.currentTarget)
        // console.log("formData", formData.get("product"))
        const response = await fetch('/api/v1/products/add-product', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + session.user.token,
          },
          body: JSON.stringify({
            userId: session.user.userId,
            dataItem: {
              product: formData.get("product"),
              merek: formData.get("merek"),
              stock: formData.get("stock"),
              capital_price: formData.get("capital_price"),
              price: formData.get("price"),
              image: imageSave}
          }),
        })
   
        if (!response.ok) {
          throw new Error('Failed to submit the data. Please try again.')
        }
   
        // Handle response if necessary
        const _data = await response.json()
        // console.log("data", data)
        setCountUpdate(countUpdate + 1)
        setOpenAdd(false)
      } catch (_error: any) {
        // Capture the error message to display to the user
        // setError(error.message)
        // console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='w-[20dvh] h-[20dvh] rounded-lg bg-slate-500 mb-3'>
        {imageSave != "" && (
            <Image 
                      src={process.env.PUBLIC_SRC+"/images/"+imageSave}
                      alt="imageProduct"
                      fill={true}
                      className="w-full h-full max-w-[20dvh] max-h-[20dvh] mt-10 mx-auto rounded-lg" 
                      unoptimized 
                      />
       )} </div>
        <form onSubmit={onSubmit} className='flex mb-5'>
            <Input
                type="file"
                name="file"
                // onChange={(e) => setFile(e.target.files?.[0])}
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    if (selectedFile.size > 500 * 1024) {
                      alert("File size must be less than 500KB.");
                      e.target.value = ""; // reset the input
                      return;
                    }
                    setFile(selectedFile);
                  }
                }}
                className='rounded-lg mr-1'
            />
            <Button type="submit" className=' rounded-lg px-3 '>Upload </Button>
        </form>
        <form onSubmit={saveSubmit} className='w-full'>
          <div className="grid w-full items-center gap-1.5 mb-3">
              <Label htmlFor="product">Product</Label>
              <Input id="product" name='product' type="text" placeholder='Liquid'/>
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3"> 
              <Label htmlFor="merek">Merek</Label>
              <Input id="merek" name='merek' type="text" placeholder='Foom'/>
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name='stock' type="number" placeholder='10'/>
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
              <Label htmlFor="capital_price">Capital Price</Label>
              <Input id="capital_price" name='capital_price' type="number" placeholder='100.000'/>
          </div>
          <div className="grid w-full  items-center gap-1.5 mb-3">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name='price' type="number" placeholder='110.000'/>
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

export default AddProduct