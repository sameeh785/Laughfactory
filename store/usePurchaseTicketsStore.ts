import { create } from "zustand"
import { IPurchaseTicket } from "@/interface/tickets"

interface IPurchaseTicketsState {
    subtotal: number
    setSubtotal: (subtotal: number) => void
    purchaseTicketList: IPurchaseTicket[]
    setPurchaseTicketList: (purchaseTicketList: IPurchaseTicket[]) => void
}

export const usePurchaseTicketsStore = create<IPurchaseTicketsState>((set) => ({
    subtotal: 0,
    setSubtotal: (subtotal) => set({ subtotal }),
    purchaseTicketList: [] as IPurchaseTicket[],
    setPurchaseTicketList: (ticketList) => set({ purchaseTicketList: ticketList }),
}))