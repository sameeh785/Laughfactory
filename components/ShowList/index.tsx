"use client";
import ComedyShowCard from "@/components/ShowList/comedy-show-card";
import PurchaseTicketModal from "@/components/ShowList/PurchaseTicketModal";
import { useModalStore } from "@/store/useModalStore";
import { useSelectedShowStore } from "@/store/useSelectedShowStore";
import { formatDate } from "@/utils/common";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ShowsList({ shows }: { shows: any[] }) {
  //hooks
  const { isModalOpen, openModal } = useModalStore();
  const { setSelectedShow} = useSelectedShowStore();
  const searchParams = useSearchParams();
  const showID = searchParams.get("showID");
  //effects
  useEffect(() => {
    if (showID) {
      openModal();
      const show = shows.find((show) => show.date_id === parseInt(showID))
      if(show) {
        setSelectedShow({
          title: show.title,
                  description: show.description,
                  image:
                    show.image ||
                    "https://cdn.laughfactory.com/images/liveshowimages/BAN0000001257.jpg",
                  comedians: show.comedians.map((comedian: any) => ({
                    name: comedian.name,
                    image:
                      comedian.image ||
                      "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg",
                  })),
                  date: formatDate(show.date, show.start_time),
                  dateId: show.date_id,
                  id: show.id,
                  is_sold_out: show.is_sold_out,
                  alert_is_percentage: show.alert_is_percentage,
                  alert_message: show.alert_message,
                  alert_quantity: show.alert_quantity,
                  thumbnail: show?.thumbnail_image || "",
                  tags : show?.tags || [],
                  show_after_sold_out: show?.show_after_sold_out || 0

        });
      }
    }
  }, [showID,shows]);
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto px-4">
        <div className="space-y-8 max-w-7xl mx-auto">
          <div className="px-6 py-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
              UPCOMING SHOWS - Hollywood
            </h2>
          </div>
          {shows?.length === 0 && (
            <div className="text-center text-gray-500 text-lg mt-4">
              No shows found
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shows?.map((show: any, index: number) => (
              <ComedyShowCard
                key={show.id || index}
                showDetails={{
                  title: show.title,
                  description: show.description,
                  image:
                    show.image ||
                    "https://cdn.laughfactory.com/images/liveshowimages/BAN0000001257.jpg",
                  comedians: show.comedians.map((comedian: any) => ({
                    name: comedian.name,
                    image:
                      comedian.image ||
                      "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg",
                  })),
                  date: formatDate(show.date, show.start_time),
                  dateId: show.date_id,
                  id: show.id,
                  is_sold_out: show.is_sold_out,
                  alert_is_percentage: show.alert_is_percentage,
                  alert_message: show.alert_message,
                  alert_quantity: show.alert_quantity,
                  thumbnail: show?.thumbnail || "",
                  tags : show?.tags || [],
                  show_after_sold_out: show?.show_after_sold_out || 0
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Ticket Modal */}
      {isModalOpen && <PurchaseTicketModal />}
    </div>
  );
}
