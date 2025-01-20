import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col absolute top-0 -z-10 w-screen">
      <main className="flex-grow flex items-center justify-center bg-[#f3efff]">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Oops! Page not found</h2>
          <p className="text-xl mb-8">
            It seems you&apos;ve wandered off the learning path. Don&apos;t worry, it&apos;s easypeasy to get back on track!
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="flex items-center justify-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center justify-center gap-2">
              <Link href="/courses">
                <BookOpen className="w-4 h-4" />
                Courses
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center justify-center gap-2">
              <Link href="/search">
                <Search className="w-4 h-4" />
                Search
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

