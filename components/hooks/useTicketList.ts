import { IPurchaseTicket, ITicket } from "@/interface/tickets"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShow"
import { showToast } from "@/utils/toast"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"

export const useTicketList = () => {
    //state
    const [loading, setLoading] = useState(true)
    const [ticketList, setTicketList] = useState<ITicket[]>([])
    // hooks
    const { selectedShow, setSelectedShow } = useSelectedShowStore()
    const { setPurchaseTicketList, purchaseTicketList } = usePurchaseTicketsStore()
    // functions
    const addQuantity = useCallback((ticketId: string) => {
        const ticket = ticketList.find((ticket) => ticket.ticket_id.toString() === ticketId)
        const purchaseTicket = purchaseTicketList?.find((t) => t.ticket_id === ticket?.ticket_id)
        if (!ticket) return
        if (ticket?.is_sold_out) {
            showToast.error('Ticket is sold out')
            return
        }
        if (ticket?.available_quantity === 0) {
            showToast.error('Ticket is sold out')
            return
        }
        setTicketList(prev => prev.map(t => t.ticket_id.toString() === ticketId ? { ...t, available_quantity: t.available_quantity - 1 } : t))
        setPurchaseTicketList(purchaseTicket ? purchaseTicketList?.map(t => t.ticket_id.toString() === ticketId ? { ...t, quantity: t.quantity + 1 } : t) : [...purchaseTicketList, { ...ticket, quantity: 1 }])
    }, [ticketList, purchaseTicketList, setTicketList, setPurchaseTicketList])

    const removeQuantity = useCallback((ticketId: string) => {
        const ticket = ticketList.find((ticket) => ticket.ticket_id.toString() === ticketId)
        const purchaseTicket = purchaseTicketList?.find((t) => t.ticket_id === ticket?.ticket_id)
        if (!ticket) return
        if (ticket?.is_sold_out) {
            showToast.error('Ticket is sold out')
            return
        }
        if (purchaseTicket?.quantity === 0) {
            return
        }
        setTicketList(prev => prev.map(t => t.ticket_id.toString() === ticketId ? { ...t, available_quantity: t.available_quantity + 1 } : t))
        setPurchaseTicketList([
            ...purchaseTicketList?.map(t => t.ticket_id.toString() === ticketId ? { ...t, quantity: t.quantity - 1 } : t) || []
        ])
    }, [ticketList, purchaseTicketList, setTicketList, setPurchaseTicketList])


    const getShowTicketList = useCallback(async () => {
        try {
            const response = await fetch(`http://34.212.24.109/api/show-tickets/${selectedShow?.dateId}`, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_API_USERNAME + ':' + process.env.NEXT_PUBLIC_API_PASSWORD).toString('base64')
                }
            })
            const { data: showTickets } = await response.json()
            if (showTickets?.length) {
                setTicketList(showTickets)
            } else {
                setTicketList([])
            }

        } catch (error) {
            showToast.error('Error fetching show ticket list')
        }
        finally {
            setLoading(false)
        }
    }, [selectedShow?.dateId])
    //effect
    useEffect(() => {
        getShowTicketList()
    }, [getShowTicketList])
    return {
        selectedShow,
        setSelectedShow,
        addQuantity,
        removeQuantity,
        loading,
        ticketList,
        purchaseTicketList
    }
}