"use client";

import { IeltsRegistrationForm } from '@/components/capture-details'
import { getStoredRegistrationData } from '@/lib/actions'
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation"

function Page() {

  const router = useRouter();

  useEffect(()=>{
    const registrationData = getStoredRegistrationData();
    if (registrationData) {
      console.log("user found already", registrationData);

      // redirect to exam page
      router.replace('/exam');

    }
    
  }, [])

  return (
    <main className="flex-grow flex items-center justify-center">
        
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className='text-4xl font-bold'>Ready To Take Your Test ?</h1>
          <h3 className='text-xl font-bold mt-3'>Let&apos;s Get Some Info from you first</h3>

          <br />

          <IeltsRegistrationForm/>
        </div>
    </main>
  )
}

export default Page