import { formatToRupiah } from "@/lib/formating";
import {  ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

// const dataProduct = [
//     {product: "item1",price: '100000', image:"/images/foomicylychee.png"},
//     {product: "item2",price: '120000', image:"/images/americanblackcurrent.png"},
//     {product: "item3",price: '200000', image:"/images/BuaqitaGummyStrawbery.png"},
//     {product: "item4",price: '300000', image:"/images/foomicylychee.png"},
//     {product: "item5",price: '100000', image:"/images/foomicylychee.png"},
//     {product: "item6",price: '120000', image:"/images/foomicylychee.png"},
//     {product: "item7",price: '200000', image:"/images/foomicylychee.png"},
//     {product: "item8",price: '300000', image:"/images/foomicylychee.png"},
//     {product: "item9",price: '100000', image:"/images/foomicylychee.png"},
//     {product: "item10",price: '120000', image:"/images/foomicylychee.png"},
//     {product: "item11",price: '200000', image:"/images/foomicylychee.png"},
//     {product: "item12",price: '300000', image:"/images/foomicylychee.png"},
// ]

function SliderProduct({dataProduct}:any) {
    const productContainerRef = useRef<HTMLDivElement>(null);

      const scrollProducts = (direction: "left" | "right") => {
        if (productContainerRef.current) {
          const scrollAmount = direction === "left" ? -window.innerWidth : window.innerWidth;
          productContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      };
  return (
    <div className="pb-10 w-full bg-pink-glow bg-opacity-40 relative flex flex-col pt-10">
        <div className="text-[10rem] absolute right-5 -top-28 inline-block font-bebasNeue text-pink-glow opacity-30 ">
            <a className="">LIQUIDS</a>
          </div>
          <div className="w-full flex space-x-5 text-pink-900 pl-10">
            <div onClick={() => scrollProducts("left")}>
            <ChevronLeftCircleIcon width={30} height={30}/>
            </div>
            <div onClick={() => scrollProducts("right")}>
            <ChevronRightCircleIcon width={30} height={30}/>
                
            </div>
          </div>
           {/* Product Box */}
      <div className="relative w-full mx-auto mt-5">
        <div
          ref={productContainerRef}
          className="flex overflow-x-scroll scrollbar-hide space-x-4"
        >
          {dataProduct.map((product:any, index:any) => (
            <div
              key={index}
              className={`flex-shrink-0 w-80 bg-white shadow rounded p-4 text-start  ${index === 0 ? "ml-10" : ""} `}
            >
                <Image 
                          src={product.image}
                          width={500}
                          height={500}
                          alt="fotoproduct"
                          />
              <h3 className="text-lg font-bebasNeue ml-5">{product.product}</h3>
              <p className="text-gray-500 ml-5 text-sm">Stock Tersedia</p>
              <p className="text-gray-800 ml-5">{ formatToRupiah(product.price) }</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SliderProduct