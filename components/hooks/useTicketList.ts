import { ITicket } from "@/interface/tickets"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShowStore"
import { showToast } from "@/utils/toast"
import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { formatDate } from "@/utils/common"

export const useTicketList = () => {
    //state
    const [loading, setLoading] = useState(true)
    const [ticketList, setTicketList] = useState<ITicket[]>([])
    // hooks
    const { selectedShow, setSelectedShow} = useSelectedShowStore()
    const { setPurchaseTicketList, purchaseTicketList } = usePurchaseTicketsStore()
    const searchParams = useSearchParams()
    const showID = searchParams.get("showID")
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
        setTicketList(prev => prev.map(t => t.ticket_id.toString() === ticketId ? { ...t, available_quantity: t.available_quantity + 1 } : t))
        setPurchaseTicketList([
            ...purchaseTicketList?.filter(t => t.ticket_id.toString() === ticketId && t.quantity === 1 ? false : true).map(t => t.ticket_id.toString() === ticketId ? { ...t, quantity: t.quantity - 1 } : t) || []
        ])
    }, [ticketList, purchaseTicketList, setTicketList, setPurchaseTicketList])


    const getShowTicketList = useCallback(async () => {
        try {
            const response = await fetch(`/api/show-tickets/${showID ? showID : selectedShow?.dateId}`)

            const { data: showDetails } = await response.json()

            if (showDetails?.show && showDetails?.tickets) {
                setTicketList(showDetails?.tickets)
                setSelectedShow({
                    ...selectedShow,
                    ...showDetails?.show,
                    date: formatDate(showDetails?.show?.date, showDetails?.show?.start_time)
                })
            } else {
                setTicketList([])
            }

        } catch (error) {
            showToast.error('Error fetching show ticket list')
        }
        finally {
            setLoading(false)
        }
    }, [showID,selectedShow])
    //effect
    useEffect(() => {
        getShowTicketList()
    }, [showID])
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