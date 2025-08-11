"use client"

import { Share2 } from "lucide-react"
import Button from "@/components/ui/Button"
import { useSelectedShowStore } from "@/store/useSelectedShowStore"
import { useModalStore } from "@/store/useModalStore"
import { useCallback } from "react"
import { showToast } from "@/utils/toast"
import { useRouter } from "next/navigation"

interface InteractiveButtonsProps {
  ticketUrl?: string
  showShareButton?: boolean
  showDetails?: any
}

export default function InteractiveButtons({ showShareButton, showDetails }: InteractiveButtonsProps) {
    // hooks
 const router = useRouter()
  // Modal state
  const { openModal } = useModalStore()
  const { setSelectedShow } = useSelectedShowStore()
  // Function
  const handleGetTickets = useCallback(() => {
     if (showDetails) {
       setSelectedShow(showDetails)
       openModal()
     } else {
       showToast.error("Show details not available")
     }
  }, [showDetails, openModal, setSelectedShow])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "Comedy Show",
        text: "Check out this comedy show!",
        url: window.location.href,
      }).then(() => {
        showToast.success("Shared successfully!")
      }).catch(() => {
        showToast.error("Failed to share")
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          showToast.success("Link copied to clipboard!")
        })
        .catch(() => {
          showToast.error("Failed to copy link")
        })
    }
  }, [])

  if (showShareButton) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4 mr-1" />
        Share
      </Button>
    )
  }

  return (
    <Button
      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-200 transform hover:scale-105 outline-none"
      onClick={handleGetTickets}
    >
      Get Tickets
    </Button>
  )
} 