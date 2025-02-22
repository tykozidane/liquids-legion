import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useEffect, useState } from "react";

// const dataCarousel = [
//   {image:'/images/foomicylychee.png'},
//   {image:'/images/americanblackcurrent.png'},
//   // {image:'/images/american-breakfast-ice-oat-blackcurrant-salt.jpg'},
// ]
// interface Carousel {
//   image: string
// }
function CarouselHeader({dataCarousel}:any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("DataCarousel", dataCarousel[0])
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dataCarousel.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);
  return (
    <div className="w-full h-screen flex flex-nowrap justify-center items-center relative">
          <div className="text-[10rem] absolute -left-5 inline-block font-bebasNeue text-pink-glow opacity-30 -rotate-90">
            LEGION
          </div>
        <div className="flex flex-col justify-center items-start lg:ml-28 h-full lg:w-[50dvw] ">
          <div className="text-7xl font-lilitaone text-black ml-3">
            Welcome to <br/> Our Store
          </div>
          <Separator className="w-52 mb-7 mt-5 bg-pink-dark h-1 "/>
          <div className="text-lg ">
            <a>we sell liquids from lot of famous brand<q/>s <br/> See our stock and go buy it</a>
          </div>
        </div>
        <div className=" animate-fade">
          <Image 
          src={dataCarousel[currentIndex].image}
          width={500}
          height={500}
          alt="fotoproduct"
          />
        </div>
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {dataCarousel.map((_ : any, index : any) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-pink-700" : "bg-pink-300"
              }`}
            ></button>
          ))}
        </div>
    </div>
  )
}

export default CarouselHeader