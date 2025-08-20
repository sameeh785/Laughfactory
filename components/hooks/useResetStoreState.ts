
import usePaymentFormStore from "@/store/usePaymentFormStore"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useCallback } from "react"

export const useResetStoreState = () => {
    const { resetForm, setAppliedCouponApiResponse,setAppliedCoupon } = usePaymentFormStore()
    const { setPurchaseTicketList, setTickets } = usePurchaseTicketsStore()
    const resetStoreState = useCallback(() => {
        setPurchaseTicketList([])
        setTickets([])
        resetForm()
        setAppliedCoupon("")
        setAppliedCouponApiResponse(null)
    }, [ setPurchaseTicketList, setTickets, resetForm, setAppliedCoupon, setAppliedCouponApiResponse])
    return { resetStoreState }
}