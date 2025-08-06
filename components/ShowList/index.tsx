import ComedyShowCard from "@/components/ShowList/comedy-show-card"
import PurchaseTicketModal from "@/components/ShowList/PurchaseTicketModal"
import { IShow } from "@/interface/shows"

// Helper function to format date
const formatDate = (dateString: string, timeString: string) => {
  const date = new Date(dateString);
  const time = timeString.split(':');
  
  return {
    month: date.toLocaleDateString('en-US', { month: 'short', weekday: 'short' }).toUpperCase(),
    day: date.getDate().toString().padStart(2, '0'),
    time: `${time[0]}:${time[1]} ${parseInt(time[0]) >= 12 ? 'PM' : 'AM'}`
  };
};

export default function ShowsList({shows}: {shows: IShow[]}) {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto px-4">
        <div className="space-y-8 max-w-7xl mx-auto">
      <div className="px-6 py-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">UPCOMING SHOWS - Hollywood</h2>
      </div>
      {shows?.length === 0 && <div className="text-center text-gray-500 text-lg mt-4">No shows found</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shows?.map((show: any, index: number) => (
            <ComedyShowCard
              key={show.id || index}
              showDetails={{
                title: show.title,
                description: show.description,
                image: show.image || "https://cdn.laughfactory.com/images/liveshowimages/BAN0000001257.jpg",
                comedians: show.comedians.map((comedian: any) => ({
                  name: comedian.name,
                  image: comedian.image || "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg"
                })),
                date: formatDate(show.date, show.start_time),
                dateId: show.date_id,
                id: show.id
              }}
            />
          ))}
          </div>
        </div>
      </div>
      {/* Ticket Modal */}
      <PurchaseTicketModal/>
    </div>
  )
}
