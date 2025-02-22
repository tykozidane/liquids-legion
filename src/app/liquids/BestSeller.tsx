import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatToRupiah } from "@/lib/formating"
import Image from "next/image"

// const dataBestSeller = [
//     {product: "item1",price: '100000', image:"/images/foomicylychee.png"},
//     {product: "item2",price: '120000', image:"/images/americanblackcurrent.png"},
//     {product: "item3",price: '200000', image:"/images/BuaqitaGummyStrawbery.png"},
//     {product: "item4",price: '200000', image:"/images/BuaqitaGummyStrawbery.png"},
// ]
function BestSeller({dataBestSeller} :any) {
  return (
    <div className="w-full py-10">
        <div className="w-full flex flex-col justify-center items-center">
            <div className="text-5xl font-lilitaone">BEST SELLER</div>
            <Separator className="h-1 bg-pink-800 w-28 mt-3 mb-5" />
        </div>
        <div className="w-full flex my-5 space-x-10 justify-center items-center ">
            {dataBestSeller.map((item:any) => (
                <div key={item.product} className="w-64 rounded-xl border  flex flex-col relative group/item bg-white">
                    <div className="w-full">
                        <Image src={item.image} alt="fotoProduct" width={400} height={400} />
                    </div>
                    <div className="mt-3 w-full flex flex-col justify-center items-center mb-10">
                        <div className="text-xl font-bebasNeue"> {item.product} </div>
                        <div className="text-gray-400"> {formatToRupiah(item.price)} </div>
                    </div>
                    <div className="absolute bg-pink-200 opacity-50 w-full h-full rounded-xl hidden group-hover/item:flex justify-center items-center">
                    </div>
                    <Button className="bg-pink-glow hover:bg-black hover:text-white absolute transition-all left-20 bottom-10 group-hover/item:bottom-40 -z-10 group-hover/item:z-10">Check This</Button>
                    {/* <div className="absolute w-full h-full -z-50 group-hover/item:z-10 group-hover/item:flex justify-center items-center translate-y-20 group-hover/item:translate-y-0 transition-all ease-in-out group-hover/item:duration-600 group-hover/item:delay-100">
                        <Button className="bg-pink-glow hover:bg-black hover:text-white ">Check This</Button>
                    </div> */}
                </div>
            ))}
        </div>
    </div>
  )
}

export default BestSeller