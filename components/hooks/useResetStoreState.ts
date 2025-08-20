
import usePaymentFormStore from "@/store/usePaymentFormStore"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"

export const useResetStoreState = () => {
    const { setCurrentStep, resetForm, setAppliedCouponApiResponse,setAppliedCoupon } = usePaymentFormStore()
    const { setPurchaseTicketList, setTickets } = usePurchaseTicketsStore()
    const resetStoreState = () => {
        setCurrentStep("thankyou")
        setPurchaseTicketList([])
        setTickets([])
        resetForm()
        setAppliedCoupon("")
        setAppliedCouponApiResponse(null)
    }
    return { resetStoreState }
}