import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <div className="bg-[#f3efff] min-h-[calc(80vh-76px)]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-6xl font-bold leading-tight">
            Improve your English.
            <br />
            It's easypeasy
          </h1>
          <Link href="/get-started">

          <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg">
            Start now
          </Button>
          </Link>
        </div>
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden">
            <Image
              src="/assets/happy-smiling-man.webp"
              alt="Student learning English"
              width={600}
              height={400}
              className="w-full h-auto"
            />
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <div className="bg-white rounded-full px-4 py-2 text-sm">
                Hi! Ready to speak?
              </div>
              <div className="bg-white rounded-full px-4 py-2 text-sm ml-auto">
                Let's start!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

