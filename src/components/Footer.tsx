import { MapPin } from 'lucide-react'
import React from 'react'

function Footer() {
  return (
    <div className='w-full flex flex-col justify-center items-center relative'>
        <div className='absolute w-full h-52 rotate-6 bg-pink-glow -z-30 opacity-30'></div>
        <div className='w-full flex lg:flex-row flex-col justify-center items-center my-10'>
            <div className='w-72 flex flex-col justify-center items-start'>
                <h1 className='text-xl font-bold mb-5'>Address</h1>
                <div className='w-64 flex font-medium'>
                <MapPin width={50} height={50} className='mr-3' /> Tegal Gundil, Bogor Utara, Kota Bogor, Jawa Barat
                </div>
            </div>
            <div className='w-72 flex flex-col justify-center items-center'>
                <h1 className='text-xl font-bold mb-5'>Features</h1>
                <div className='w-64 flex font-medium'>
                    
                </div>
            </div>
            <div className='w-72 flex flex-col justify-end items-end'>
                <h1 className='text-xl font-bold mb-5'>Contact Us</h1>
            </div>
        </div>
        <div>
            <p>&copy; 2024 Liquids Legion.  All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer