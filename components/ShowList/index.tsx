import ComedyShowCard from "./comedy-show-card"
import PurchaseTicketModal from "./PurchaseTicketModal"


// Example data structure
const showsData = [
  {
    title: "Mike Binder & Friends!",
    subtitle: "Laugh Factory Hollywood presents: Mike Binder & Friends",
    bannerImage: "https://cdn.laughfactory.com/images/liveshowimages/BAN0000001257.jpg",
    comedians: [
      { name: "Mike Binder", image:  "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Jeff Dye", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Jetski Johnson", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Adam Hunter", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Vinny Fasline", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Greg Baldwin", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Chris Ramos", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
    ],
    date: {
      month: "MON AUG",
      day: "04",
      time: "8:00 PM",
    },
    ticketUrl: "https://example.com/tickets",
  },
  {
    title: "Mike Binder & Friends!",
    subtitle: "Laugh Factory Hollywood presents: Mike Binder & Friends",
    bannerImage: "https://cdn.laughfactory.com/images/liveshowimages/BAN0000001257.jpg",
    comedians: [
      { name: "Mike Binder", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Jeff Dye", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Jetski Johnson", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Adam Hunter", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Vinny Fasline", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Greg Baldwin", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Chris Ramos", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
    ],
    date: {
      month: "MON AUG",
      day: "04",
      time: "8:00 PM",
    },
    ticketUrl: "https://example.com/tickets",
  },
  {
    title: "Mike Binder & Friends!",
    subtitle: "Laugh Factory Hollywood presents: Mike Binder & Friends",
    bannerImage: "https://cdn.laughfactory.com/images/liveshowimages/BAN0000001257.jpg",
    comedians: [
      { name: "Mike Binder", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Jeff Dye", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Jetski Johnson", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Adam Hunter", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Vinny Fasline", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Greg Baldwin", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
      { name: "Chris Ramos", image: "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg" },
    ],
    date: {
      month: "MON AUG",
      day: "04",
      time: "8:00 PM",
    },
    ticketUrl: "https://example.com/tickets",
  },
]

export default function ShowsList() {


  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto px-4">
        <div className="space-y-8 max-w-7xl mx-auto">
      <div className="px-6 py-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">UPCOMING SHOWS - Hollywood</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showsData.map((show, index) => (
            <ComedyShowCard
              key={index}
              showDetails={
                {
                  title: show.title,
                  subtitle: show.subtitle,
                  bannerImage: show.bannerImage,
                  comedians: show.comedians,
                  date: show.date,
                  ticketUrl: show.ticketUrl,
                }
              }
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
