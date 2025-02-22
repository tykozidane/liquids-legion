'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
export default function NavBarPublic() {
    return (
        <div className="w-full lg:h-20 lg:px-10 flex lg:flex-row flex-col justify-center items-center" id="navbar">
        <div className="flex justify-center items-center mt-5 w-full lg:w-52 xl:w-60 lg:mt-0" id="title-nav">
          <div className="" id="logo-nav">
            <Image 
            src='/images/justlogo.png'
            alt="Logo"
            width={50}
            height={50}
            />
          </div>
          <div className="hidden font-lilitaone text-2xl lg:flex gradient-text" id="name-nav">
            Liquids Legion
          </div>
        </div>
        <div className="grow flex justify-center items-center font-bebasNeue text-xl mt-3 lg:mt-0 space-x-14" id="nav-list">
          <div className="">Liquids</div>
          <div className="">Our Store</div>
          <div className="">Blog</div>
          <div className="">About Us</div>
        </div>
        <div className="w-full lg:w-52 xl:w-60 flex justify-center items-center" id="rightside-nav">
          <div className="flex w-full max-w-sm items-center bg-pink-glow hover:bg-black rounded-lg group/search">
            <Input type="search" placeholder="Search" className="bg-white" />
            <Button type="submit" className="bg-pink-glow group-hover/search:bg-black group-hover/search:text-white"> <Search/> </Button>
          </div>
        </div>
      </div>
    )
}