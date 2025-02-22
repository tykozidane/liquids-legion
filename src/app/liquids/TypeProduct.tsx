import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import React from 'react'

function TypeProduct() {
  return (
    <div className='w-full py-20 flex flex-col'>
        <div className='w-full flex flex-col lg:flex-row justify-center items-center relative'>
            <div className='transition duration-700 ease-linear 
                        transform hover:-translate-y-1 hover:scale-110'>
                <Image
                    src='/images/BuaqitaGummyStrawbery.png'
                    alt={'fotoProduct'}
                    width={400}
                    height={500}
                />
            </div>
            <div className='w-full lg:w-[40dvw] lg:ml-28 flex flex-col justify-center items-start'>
                <div className=' text-5xl font-bebasNeue uppercase'>Liquids</div>
                <Separator className='w-24 h-1 bg-pink-dark mt-2 mb-5' />
                <p>Find your desire flavour<br/>we will help get what you want, every person have their own taste</p>
                <Button className=' mt-5 bg-pink-glow text-white hover:bg-black'>Find More</Button>
            </div>
            <div className="text-[10rem] absolute left-10 -bottom-36 inline-block font-bebasNeue text-pink-glow opacity-20">
            Desire
          </div>
        </div>
        <div className='w-full flex flex-col lg:flex-row-reverse justify-center items-center relative'>
            <div className='transition duration-700 ease-linear 
                        transform hover:-translate-y-1 hover:scale-110'>
                <Image
                    src='/images/device.png'
                    alt={'fotoProduct'}
                    width={400}
                    height={500}
                />
            </div>
            <div className='w-full lg:w-[40dvw] lg:ml-16 flex flex-col justify-center items-start'>
                <div className=' text-5xl font-bebasNeue uppercase'>Device</div>
                <Separator className='w-24 h-1 bg-pink-dark mt-2 mb-5' />
                <p>Make your start with a compatible device<br/>different kit can make different taste, find your favorite</p>
                <Button className=' mt-5 bg-pink-glow text-white hover:bg-black'>Find More</Button>
            </div>
            <div className="text-[10rem] absolute right-5 -bottom-24 inline-block font-bebasNeue text-pink-glow opacity-30 -rotate-90">
            taste
          </div>
        </div>
        <div className='w-full flex flex-col lg:flex-row justify-center items-center relative'>
            <div className='transition duration-700 ease-linear 
                        transform hover:-translate-y-1 hover:scale-110'>
                <Image
                    src='/images/aksesoris.png'
                    alt={'fotoProduct'}
                    width={400}
                    height={500}
                />
            </div>
            <div className='w-full lg:w-[40dvw] lg:ml-28 flex flex-col justify-center items-start'>
                <div className=' text-5xl font-bebasNeue uppercase'>Aksesoris</div>
                <Separator className='w-24 h-1 bg-pink-dark mt-2 mb-5' />
                <p>Customize your pods style<br/>confidence exist from what you wearing</p>
                <Button className=' mt-5 bg-pink-glow text-white hover:bg-black'>Find More</Button>
            </div>
            <div className="text-[10rem] absolute left-60 -bottom-56 inline-block font-bebasNeue text-pink-glow opacity-30">
            Style
          </div>
        </div>
    </div>
  )
}

export default TypeProduct