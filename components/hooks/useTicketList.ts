import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShowStore"
import { showToast } from "@/utils/toast"
import { useCallback, useEffect, useState } from "react"
// import { useSearchParams } from "next/navigation"
// import { formatDate } from "@/utils/common"
import { ITicket, ITicketList } from "@/interface/tickets"

export const useTicketList = () => {
    //state
    const [loading, setLoading] = useState(true)
    const [alertMessage, setAlertMessage] = useState('')
    // hooks
    const { selectedShow, setSelectedShow } = useSelectedShowStore()
    const { setPurchaseTicketList, purchaseTicketList, setTickets, tickets } = usePurchaseTicketsStore()
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
        if(!selectedShow) {
            setLoading(false)
            return
        }
        try {
            setLoading(true)    
            const response = await fetch(`/api/show-tickets/${selectedShow?.dateId}`)
            const { data: showDetails } = await response.json()
            if (showDetails?.show && showDetails?.tickets) {
                console.log(showDetails?.tickets,"showDetails?.tickets");
                setTickets(showDetails?.tickets)
                setPurchaseTicketList(showDetails?.tickets.map((ticket: ITicket) => ({
                    ...ticket,
                    quantity: 0
                })))
                // setSelectedShow({
                //     ...selectedShow,
                //     ...showDetails?.show,
                //     date: formatDate(showDetails?.show?.date, showDetails?.show?.start_time)
                // })
            } else {
                setTickets([])
            }

        } catch (error) {
            showToast.error('Error fetching show ticket list')
        }
        finally {
            setLoading(false)
        }
    }, [selectedShow])


    const checkifPoolIsFull = (purchaseTicket?: ITicketList) => {
        const totalPoolTickets = purchaseTicketList?.filter((ticket) => ticket.is_in_pool).reduce((acc, ticket) => acc + ticket.quantity, 0)
        if(purchaseTicket?.is_in_pool && purchaseTicket?.pool_capacity && totalPoolTickets >= purchaseTicket?.pool_capacity){
            return true
        }
        return false

    }

    const isToSetAlertMessage = useCallback(() => {
        if (selectedShow?.alert_quantity && tickets?.length) {
            const available_quantity = tickets?.reduce((acc, ticket) => acc + ticket.available_quantity, 0)
            if(selectedShow?.alert_is_percentage) {
               const totalQuantityAvailable =  tickets?.reduce((acc, ticket) => acc + ticket.available_quantity, 0)
               const totalQuantity =  tickets?.reduce((acc, ticket) => acc + ticket.quantity, 0)
               const percentage = (totalQuantityAvailable * 100)/ totalQuantity
               if(percentage === selectedShow?.alert_quantity) {
                setAlertMessage(selectedShow?.alert_message)
               }
            } else if(available_quantity === selectedShow?.alert_quantity) {
                setAlertMessage(selectedShow?.alert_message)
            }
        }
    }, [selectedShow,tickets])
    //effect
    useEffect(() => {
        if (tickets.length === 0) getShowTicketList()
        else setLoading(false)
    }, [selectedShow])
    useEffect(() => {
        isToSetAlertMessage()
    }, [tickets, selectedShow])
    return {
        selectedShow,
        setSelectedShow,
        addQuantity,
        removeQuantity,
        loading,
        tickets,
        purchaseTicketList,
        alertMessage,
        checkifPoolIsFull
    }
}