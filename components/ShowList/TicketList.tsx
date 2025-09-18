import { useTicketList } from '@/components/hooks/useTicketList'
import { Minus, Plus } from 'lucide-react'
import React from 'react'
import Loader from '@/components/ui/Loader'
import { cn } from '@/utils/common'

export default function TicketList() {
    // hooks
    const { selectedShow, addQuantity, removeQuantity, loading, tickets, purchaseTicketList, alertMessage, checkifPoolIsFull } = useTicketList()
    
    if (loading) {
        return (
            <div className="lg:col-span-2 flex justify-center items-center min-h-[200px]">
                <Loader size="lg" />
            </div>
        )
    }
    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
               <div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedShow?.title}</h2>
                <p className="text-gray-600 mb-4">
                    {selectedShow?.date}
                </p>
                <p className="text-gray-700">{selectedShow?.description}</p>
               </div>
               <div>
               {alertMessage && <p className="font-2xl font-bold rounded-2xl bg-orange-500 text-white p-2">{alertMessage}</p>}
               </div>
            </div>
            {tickets?.length === 0 && <div className="text-center text-gray-500 text-lg mt-4">No tickets found for this show</div>}
            {/* Ticket Options */}
            <div className="space-y-4">
                {tickets.map((ticket) => {
                    const purchaseTicket = purchaseTicketList.find((purchaseTicket) => purchaseTicket.ticket_id === ticket.ticket_id)
                    return (
                        <div key={ticket.ticket_id} className={cn("border-2 border-orange-200 rounded-lg p-4", {
                            "opacity-50 cursor-not-allowed": ticket.available_quantity === 0,
                        })}>
                            <div className="flex justify-between items-start mb-3">
                                <div className={
                                    cn({
                                        "flex-1": ticket.available_quantity > 0,
                                        "flex justify-between flex-1": ticket.available_quantity === 0,
                                    })
                                }>
                                    <h3 className="text-lg font-semibold text-gray-900">{ticket.name}</h3>
                                    {ticket.available_quantity === 0 && <div className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-2">Sold Out</div>}
                                </div>
                                {ticket.available_quantity > 0 && <div className="flex items-center gap-3 text-gray-500">
                                    <button
                                        onClick={() => removeQuantity(ticket.ticket_id.toString())}
                                        disabled={!purchaseTicket || purchaseTicket?.quantity === 0}
                                        className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{purchaseTicket?.quantity || 0}</span>
                                    <button
                                        onClick={() => addQuantity(ticket.ticket_id.toString())}
                                        disabled={ticket.available_quantity === 0 || purchaseTicket?.quantity === ticket.available_quantity || checkifPoolIsFull(purchaseTicket)}
                                        className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                }
                            </div>

                            {ticket.available_quantity > 0 && <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>}

                            <div className="text-lg font-bold text-gray-900">
                                ${parseFloat(ticket.price).toFixed(2)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}