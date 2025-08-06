
import { useModalStore } from "@/store/useModalStore"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShow"
import { showToast } from "@/utils/toast"
import { useCallback, useEffect, useMemo, useState } from "react"

export const usePurchaseTicket = () => {
    // hooks
    const { isModalOpen, closeModal } = useModalStore()
    const { selectedShow } = useSelectedShowStore()
    const [currentStep, setCurrentStep] = useState<"tickets" | "payment">("tickets")
    const { purchaseTicketList } = usePurchaseTicketsStore()
    const { setPurchaseTicketList } = usePurchaseTicketsStore()
    // functions
    const handlePurchase = useCallback(() => {
        setCurrentStep("payment")
    }, [])
    const handlePaymentSubmit = useCallback((paymentData: any) => {
        showToast.success("Payment successful!")
        closeModal()
        // Reset states
        setCurrentStep("tickets")
        setPurchaseTicketList([])
    }, [closeModal, setCurrentStep, setPurchaseTicketList])

    // state
    const [termsAccepted, setTermsAccepted] = useState(false)
    // calculations
    const subtotal = useMemo(() => purchaseTicketList.reduce((sum, option) => {
        return sum + parseFloat(option.price) * option.quantity
    }, 0), [purchaseTicketList])
    const hasTicketsSelected = useMemo(() => purchaseTicketList.some((ticket) => ticket.quantity > 0), [purchaseTicketList])

    // effects
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isModalOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal()
            }
        }
        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            setCurrentStep("tickets")
        }
    }, [isModalOpen, closeModal, setCurrentStep])

    return {
        currentStep,
        setCurrentStep,
        subtotal,
        hasTicketsSelected,
        termsAccepted,
        setTermsAccepted,
        selectedShow,
        closeModal,
        isModalOpen,
        handlePurchase,
        handlePaymentSubmit,
        purchaseTicketList
    }
}