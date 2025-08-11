import { create } from "zustand"
import { ITicketList } from "@/interface/tickets"

interface IPurchaseTicketsState {
    subtotal: number,
    tickets : ITicketList[]
    setSubtotal: (subtotal: number) => void
    setTickets: (tickets: ITicketList[]) => void
    purchaseTicketList: ITicketList[]
    setPurchaseTicketList: (purchaseTicketList: ITicketList[]) => void
}

export const usePurchaseTicketsStore = create<IPurchaseTicketsState>((set) => ({
    subtotal: 0,
    setSubtotal: (subtotal) => set({ subtotal }),
    tickets: [],
    setTickets: (tickets) => set({ tickets }),
    purchaseTicketList: [],
    setPurchaseTicketList: (ticketList) => set({ purchaseTicketList: ticketList }),
}))