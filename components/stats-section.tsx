import Image from 'next/image'
import { Star } from 'lucide-react';

export function StatsSection() {
  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-4xl font-bold">10.000+</div>
          <div className="text-gray-600">satisfied students</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold">40+</div>
          <div className="text-gray-600">native teachers</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold">60.000+</div>
          <div className="text-gray-600">lesson hours delivered</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold flex items-center justify-center gap-2">
            4.9
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="text-gray-600">rating on Trustpilot</div>
        </div>
      </div>
    </div>
  )
}

