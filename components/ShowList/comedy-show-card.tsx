import Image from "next/image"
import InteractiveButtons from "@/components/ShowList/InteractiveButtons"
import ComedianList from "@/components/ShowList/ComedianList"
import { IShow, ITag } from "@/interface/shows"
import { cn } from "@/utils/common"

interface ShowCardProps {
    showDetails: IShow
    key: string
}

export default function ComedyShowCard({
    showDetails,
    key
}: ShowCardProps) {
    if(!showDetails?.show_after_sold_out && showDetails?.is_sold_out) return null;
    return (
        <div key={key} className={cn("bg-white rounded-lg shadow-lg", {
            "opacity-70": showDetails?.is_sold_out
        })}>
            {/* Banner Image */}
            <div className="relative h-48 rounded-t-lg">
                <Image src={showDetails.image || "/placeholder.svg"} alt={showDetails.title} fill className="object-image-initial rounded-t-lg" />
                {/* Time Badge */}
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {showDetails.date}
                </div>
            </div>

            <div className="px-6 py-4">
                <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 min-w-0">
                        {/* Title and Subtitle */}
                        <div className="mb-3">
                           <div className="flex items-center gap-2 my-1 max-h-[80px] scroll-v">
                           {
                                showDetails?.tags?.map((tag: ITag) => (
                                    <div key={tag.id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                        {
                                            tag.name
                                        }
                                    </div>
                                ))
                            }
                           </div>
                            <h3 className="text-[20px] font-bold text-gray-900 mb-2 truncate">
                                {showDetails.title}
                            </h3>
                            <div className="text-gray-600 text-[14px] min-h-[30px] max-h-[30px] truncate" dangerouslySetInnerHTML={{ __html: showDetails.description }} />
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
                            <div className="!mt-3"> <InteractiveButtons showDetails={showDetails} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
