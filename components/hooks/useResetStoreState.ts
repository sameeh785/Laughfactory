
import usePaymentFormStore from "@/store/usePaymentFormStore"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"

export const useResetStoreState = () => {
    const { setCurrentStep, resetForm } = usePaymentFormStore()
    const { setPurchaseTicketList, setTickets } = usePurchaseTicketsStore()
    const resetStoreState = () => {
        setCurrentStep("tickets")
        setPurchaseTicketList([])
        setTickets([])
        resetForm()
    }
    return { resetStoreState }
}