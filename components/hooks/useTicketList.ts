import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShowStore"
import { showToast } from "@/utils/toast"
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { formatDate } from "@/utils/common"

export const useTicketList = () => {
    //state
    const [loading, setLoading] = useState(true)
    // hooks
    const { selectedShow, setSelectedShow } = useSelectedShowStore()
    const { setPurchaseTicketList, purchaseTicketList, setTickets, tickets } = usePurchaseTicketsStore()
    const searchParams = useSearchParams()
    const showID = searchParams.get("showID")
    // functions
    const addQuantity = useCallback((ticketId: string) => {
        const ticket = tickets.find((ticket) => ticket.ticket_id.toString() === ticketId)
        const purchaseTicket = purchaseTicketList?.find((t) => t.ticket_id === ticket?.ticket_id)
        if (!ticket) return
        if (ticket?.available_quantity === 0) {
            showToast.error('Ticket is sold out')
            return
        }
        // const updatedTickets = tickets.map(t => t.ticket_id.toString() === ticketId ? { ...t, available_quantity: t.available_quantity - 1 } : t)
        // setTickets(updatedTickets)
        setPurchaseTicketList(purchaseTicket ? purchaseTicketList?.map(t => t.ticket_id.toString() === ticketId ? { ...t, quantity: t.quantity + 1 } : t) : [...purchaseTicketList, { ...ticket, quantity: 1 }])
    }, [tickets, purchaseTicketList, setTickets, setPurchaseTicketList])


    const removeQuantity = useCallback((ticketId: string) => {
        // const updatedTickets = tickets.map(t => t.ticket_id.toString() === ticketId ? { ...t, available_quantity: t.available_quantity + 1 } : t)
        // setTickets(updatedTickets)
        setPurchaseTicketList([
            ...purchaseTicketList?.filter(t => t.ticket_id.toString() === ticketId && t.quantity === 1 ? false : true).map(t => t.ticket_id.toString() === ticketId ? { ...t, quantity: t.quantity - 1 } : t) || []
        ])
    }, [tickets, purchaseTicketList, setTickets, setPurchaseTicketList])


    const getShowTicketList = useCallback(async () => {
        try {
            setLoading(true)    
            const response = await fetch(`/api/show-tickets/${showID ? showID : selectedShow?.dateId}`)

            const { data: showDetails } = await response.json()

            if (showDetails?.show && showDetails?.tickets) {
                setTickets(showDetails?.tickets)
                setSelectedShow({
                    ...selectedShow,
                    ...showDetails?.show,
                    date: formatDate(showDetails?.show?.date, showDetails?.show?.start_time)
                })
            } else {
                setTickets([])
            }

        } catch (error) {
            showToast.error('Error fetching show ticket list')
        }
        finally {
            setLoading(false)
        }
    }, [showID, selectedShow])
    //effect
    useEffect(() => {
        if (tickets.length === 0) getShowTicketList()
        else setLoading(false)
    }, [showID, tickets])
    return {
        selectedShow,
        setSelectedShow,
        addQuantity,
        removeQuantity,
        loading,
        tickets,
        purchaseTicketList
    }
}