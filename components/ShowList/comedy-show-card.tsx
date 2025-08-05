import Image from "next/image"
import InteractiveButtons from "./InteractiveButtons"
import ComedianList from "./ComedianList"

interface Comedian {
  name: string
  image: string
}

interface ShowCardProps {
  showDetails: {
    title: string
    subtitle: string
    bannerImage: string
    comedians: Comedian[]
    date: {
      month: string
      day: string
      time: string
    }
    ticketUrl: string
  }
}

export default function ComedyShowCard({
  showDetails,
}: ShowCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Banner Image */}
      <div className="relative h-48 bg-black rounded-t-lg">
        <Image src={showDetails.bannerImage || "/placeholder.svg"} alt={showDetails.title} fill className="object-contain" />
        {/* Decorative stars */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent rounded-t-lg">
          <div className="absolute top-4 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-16 w-1 h-1 bg-cyan-300 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-6 right-12 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1 min-w-0">
            {/* Title and Subtitle */}
            <div className="mb-3">
              <h3 className="text-[20px] font-bold text-gray-900 mb-2 truncate">{showDetails.title}</h3>
              <p className="text-gray-600 text-[14px] line-clamp-2">{showDetails.subtitle}</p>
            </div>

            {/* Comedians Section */}
              <ComedianList comedians={showDetails.comedians} />
            {/* Fine Print */}
            <div className="mt-3 text-xs text-gray-500 space-y-1 text-center">
              <p>
                Prices, performers, and schedule are subject to change. A two-item minimum purchase per patron is
                required.Vouchers are not redeemable at the door.
              </p>
                {/* Interactive Buttons */}
            <div className="!mt-3"> <InteractiveButtons ticketUrl={showDetails.ticketUrl} showDetails={showDetails} /></div>
            </div>
          </div>

          {/* Date Card */}
          {/* <div className="flex-shrink-0">
            <div className="bg-white border-4 border-orange-500 rounded-lg p-4 text-center min-w-[140px]">
              <div className="bg-orange-500 text-white text-sm font-semibold py-1 px-3 rounded-t -mx-4 -mt-4 mb-3">
                {showDetails.date.month}
              </div>
              <div className="text-4xl font-bold text-orange-500 mb-1">{showDetails.date.day}</div>
              <div className="text-sm text-gray-600 mb-3">{showDetails.date.time}</div>
              <InteractiveButtons ticketUrl={showDetails.ticketUrl} showShareButton />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
