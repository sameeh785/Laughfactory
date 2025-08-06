import { create } from "zustand"
import { IPurchaseTicket } from "@/interface/tickets"

interface IPurchaseTicketsState {
    purchaseTicketList: IPurchaseTicket[]
    setPurchaseTicketList: (purchaseTicketList: IPurchaseTicket[]) => void
}

export const usePurchaseTicketsStore = create<IPurchaseTicketsState>((set) => ({
    purchaseTicketList: [] as IPurchaseTicket[],
    setPurchaseTicketList: (ticketList) => set({ purchaseTicketList: ticketList }),
}))