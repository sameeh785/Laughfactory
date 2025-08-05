import { useSelectedShowStore } from '@/store/selectedShow'
import { Minus, Plus } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'

interface TicketOption {
    id: string
    name: string
    price: number
    fees: number
    description: string
    timeSlot: string
}

interface TicketListProps {
    quantities: Record<string, number>
    setQuantities: Dispatch<SetStateAction<Record<string, number>>>
    ticketOptions: TicketOption[]
}

export default function TicketList({ quantities, setQuantities, ticketOptions }: TicketListProps) {
    
    // hooks
    const { selectedShow } = useSelectedShowStore()
    // functions
    const updateQuantity = (ticketId: string, change: number) => {
        setQuantities((prev) => ({
            ...prev,
            [ticketId]: Math.max(0, prev[ticketId] + change),
        }))
    }
    return (
        <div className="lg:col-span-2 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedShow?.title}</h2>
                <p className="text-gray-600 mb-4">
                    {selectedShow?.date?.month} {selectedShow?.date?.day} at {selectedShow?.date?.time}
                </p>
                <p className="text-gray-700">{selectedShow?.subtitle}</p>
            </div>

            {/* Ticket Options */}
            <div className="space-y-4">
                {ticketOptions.map((option) => (
                    <div key={option.id} className="border-2 border-orange-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{option.name}</h3>
                                <p className="text-sm text-gray-600">{option.timeSlot}</p>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <button
                                    onClick={() => updateQuantity(option.id, -1)}
                                    disabled={quantities[option.id] === 0}
                                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{quantities[option.id]}</span>
                                <button
                                    onClick={() => updateQuantity(option.id, 1)}
                                    className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>

                        <div className="text-lg font-bold text-gray-900">
                            ${(option.price + option.fees).toFixed(2)}
                            <span className="text-sm font-normal text-gray-600"> incl. ${option.fees.toFixed(2)} fees</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}