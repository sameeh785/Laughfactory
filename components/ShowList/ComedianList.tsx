"use client"

import Image from "next/image"
import Tooltip from "../ui/Tooltip"

interface Comedian {
  name: string
  image: string
}

interface ComedianCarouselProps {
  comedians: Comedian[]
}

export default function ComedianCarousel({ comedians }: ComedianCarouselProps) {
  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Features comedians:</h4>
        <div className="flex gap-4 max-w-[368px] overflow-scroll scroll-v pb-3">
          {comedians.map((comedian, index) => (
            <div key={index} className="flex flex-col items-center justify-center flex-shrink-0">
              <Tooltip content={comedian.name} placement="top">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-4 border-orange-400 mb-2 hover:border-orange-500 transition-colors group cursor-pointer">
                  <Image
                    src={comedian.image || "/placeholder.svg"}
                    alt={comedian.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                  />
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
    </div>
  )
} 