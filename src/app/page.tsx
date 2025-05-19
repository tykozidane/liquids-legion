'use client'

import NavBarPublic from "@/components/NavBarPublic";
import CarouselHeader from "./liquids/CarouselHeader";
import SliderProduct from "./liquids/SliderProduct";
// import FromChatGPT from "./FromChatGPT";
import TypeProduct from "./liquids/TypeProduct";
import BestSeller from "./liquids/BestSeller";
import KontenSection from "./liquids/KontenSection";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import LoaderCircleRound from "@/components/loader/LoaderCircleRound";


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

  // useEffect(()=>{
  //   if(percent < 80) {
  //     setPercent(percent + 1)
  //   } else if(dataListPart != null){
  //     if(percent < 100) {
  //       setPercent(percent + 1)
  //     } else {
  //       setLoading(false)
  //     }
  //   } 
  // },[percent])
//   const loop = setInterval(() => {
//     if (percent < 90) {
//       setPercent(percent + 1)
//     } else if(percent < 100 && dataListPart != null) {
//       setPercent(percent + 1)
//     } 
//     else if(percent == 100 && dataListPart != null) {
//       clearInterval(loop)
//   } 
// }, 300)
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
          // console.log("Res", response);
          const datanya = response.data;
          // console.log("Datanya", datanya);
          setDataCarousel(datanya.carousel)
          setDataBestSeller(datanya.best_seller)
          setDataProduct(datanya.list_product)
          setTimeout(() => {
            setDataListPart(datanya.list_part)
          },5000)
          setYoutube(datanya.youtube)
          // setLoading(true);
        });
    };
    getData()
  },[])
  return (
  <div className="">
    { dataListPart == null && (
      <div className=" sticky top-0 z-50 w-full h-dvh bg-white flex justify-center items-center">
        <LoaderCircleRound color={'#000000'} />
    </div>
    )}
    
    {dataListPart != null && (
      <>
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
      </>
    )}
      
  </div>
  );
}
