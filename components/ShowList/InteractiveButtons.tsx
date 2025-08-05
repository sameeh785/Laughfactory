"use client"

import { Share2 } from "lucide-react"
import Button from "../ui/Button"
import { useSelectedShowStore } from "@/store/selectedShow"
import { useModalStore } from "@/store/useModalStore"

interface InteractiveButtonsProps {
  ticketUrl?: string
  showShareButton?: boolean
  showDetails?: {
    title: string
    subtitle: string
    bannerImage: string
    comedians: any[]
    date: any
    ticketUrl: string
  }
}

export default function InteractiveButtons({ ticketUrl, showShareButton, showDetails }: InteractiveButtonsProps) {
  // Modal state
  const { openModal } = useModalStore()
  const { setSelectedShow } = useSelectedShowStore()
  // Function
  const handleGetTickets = () => {
     setSelectedShow(showDetails)
     openModal()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Comedy Show",
        text: "Check out this comedy show!",
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

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