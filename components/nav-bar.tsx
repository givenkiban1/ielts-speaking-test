"use client";

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation' 
import { useEffect, useState } from 'react';
import { clearStoredRegistrationData, getStoredRegistrationData } from '@/lib/actions';

export function NavBar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState(null);
  const router = useRouter();

  useEffect(()=>{
    const registrationData = getStoredRegistrationData();
    if (registrationData) {
      console.log("user found already", registrationData);

      // update details on navbar
      setUserName(registrationData.name);
    }
  }, []);

  const handleLogout = () => {
    clearStoredRegistrationData();

    // redirect to home
    router.push('/');

  }

  return (
    <nav className={`flex items-center justify-between px-6 py-4 ${
      ['/get-started', '/exam'].indexOf(pathname)>-1  ? 'bg-[#f3efff]' : 'bg-white'
    }`}>
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo.svg"
            width={50}
            height={50}
            alt='logo'
          />
        </Link>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-1">
            Courses
            <ChevronDown className="w-4 h-4" />
          </button>
          {userName && (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-black">
                Dashboard
              </Link>
              <Link href="/exam" className="text-gray-600 hover:text-black">
                Take the Test
              </Link>
              <Link href="/dashboard/results" className="text-gray-600 hover:text-black">
                Results
              </Link>
            </>
          )}
          <Link href="#" className="text-gray-600 hover:text-black">
            About us
          </Link>
          <Link href="#" className="text-gray-600 hover:text-black">
            Prices
          </Link>
          

        </div>
      </div>
      <div className="flex items-center gap-4">
        {!userName && <><button className="flex items-center gap-1">
          English
          <ChevronDown className="w-4 h-4" />
        </button>
        <Button variant="outline">Login</Button>
        <Link href="/get-started">
        <Button className="bg-black text-white hover:bg-gray-800">Start now</Button>
        </Link>
        </>}
        {
          userName && <div className="flex items-center gap-4">
            <span className="text-gray-600">Hi, {userName}</span>
            <Button variant="outline" className='bg-red-400 hover:bg-red-600' onClick={handleLogout}>Logout</Button>
          </div>
        }
      </div>
    </nav>
  )
}

