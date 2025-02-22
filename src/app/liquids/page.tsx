'use client'

import NavBarPublic from "@/components/NavBarPublic";
import CarouselHeader from "./CarouselHeader";
import SliderProduct from "./SliderProduct";
// import FromChatGPT from "./FromChatGPT";
import TypeProduct from "./TypeProduct";
import BestSeller from "./BestSeller";
import KontenSection from "./KontenSection";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";


interface ListPart  {
  name: string,
  active: boolean
}

interface Carousel {
  image: string
}
interface Product {
  product: string,
  price: number,
  image: string
}
export default function Home() {
  const [dataCarousel, setDataCarousel] = useState<Carousel[] | null>(null)
  const [dataBestSeller, setDataBestSeller] = useState<Product[] | null>(null)
  const [dataProduct, setDataProduct] = useState<Product[] | null>(null)
  const [dataListPart, setDataListPart] = useState<ListPart[] | null>(null)
  const [youtube, setYoutube] = useState("")
  const [percent, setPercent] = useState(0)

  // useEffect(()=>{
  //   if(percent < 60) {
  //     setPercent(percent + 1)
  //   } else if(percent < 100 && dataListPart != null){
  //     setPercent(percent + 1)
  //   }
  // },[percent])
//   const loop = setInterval(() => {
//     if (percent < 100) {
//       setPercent(percent + 1)
//     } else {
//         clearInterval(loop)
//     }
// }, 1000)
  useEffect(()=>{
    const getData = async () => {
      // setLoading(true);
      fetch(`${process.env.API_URL}/api/v1/home`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((item: any) => item.json())
        .then((response: any) => {
          console.log("Res", response);
          const datanya = response.data;
          console.log("Datanya", datanya);
          setDataCarousel(datanya.carousel)
          setDataBestSeller(datanya.best_seller)
          setDataProduct(datanya.list_product)
          setDataListPart(datanya.list_part)
          setYoutube(datanya.youtube)
          // setLoading(true);
        });
    };
    getData()
  },[])
  return (
   <div className="">
    <div className=" sticky top-0 z-50 w-full h-dvh bg-white flex justify-center items-center">
      <div className="loading-container  flex justify-center items-center">
            <div className="loading-line-container">
                <span className="loading-percent text-black"> {percent}%</span>
                <div className={`loading-line startLoading w-[${percent}%]`}></div>
            </div>
        </div>
    </div>
    
      <NavBarPublic/>
      {dataListPart?.map((part, index) => {
        if(part.name == "carousel" && part.active === true && dataCarousel != null){
          // console.log("cekCarousel", dataCarousel)
          return <CarouselHeader key={index} dataCarousel={dataCarousel}/>
        } else if (part.name == "slider" && part.active === true && dataProduct != null){
          // console.log("cekCarousel", dataCarousel)
          return <SliderProduct key={index} dataProduct={dataProduct}/>
        } else if (part.name == "type_product" && part.active === true) {
          return  <TypeProduct key={index}/>
        } else if (part.name == "best_seller" && part.active === true && dataBestSeller != null) {
          return  <BestSeller key={index} dataBestSeller={dataBestSeller}/>
        }else if (part.name == "konten" && part.active === true && youtube != "") {
          return  <KontenSection key={index} youtube={youtube}/>
        }
        return null
      })}
      {/* <FromChatGPT /> */}
      <Footer/>
   </div>
  );
}
