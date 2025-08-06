
import { useModalStore } from "@/store/useModalStore"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShowStore"
import { showToast } from "@/utils/toast"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export const usePurchaseTicket = () => {
    // hooks
    const { isModalOpen, closeModal } = useModalStore()
    const { selectedShow } = useSelectedShowStore()
    const [currentStep, setCurrentStep] = useState<"tickets" | "payment">("tickets")
    const { purchaseTicketList } = usePurchaseTicketsStore()
    const { setPurchaseTicketList } = usePurchaseTicketsStore()
    const formRef = useRef<HTMLFormElement>(null)
    const submitFormRef = useRef<((e?: React.FormEvent) => void) | null>(null)

    // state
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [promoCode, setPromoCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [discount, setDiscount] = useState(0)

    // calculations
    const subtotal = useMemo(() => {
        const total = purchaseTicketList.reduce((sum, option) => {
            return sum + parseFloat(option.price) * option.quantity
        }, 0) - discount
        return total > 0 ? total : 0
    }, [purchaseTicketList, discount])
    const hasTicketsSelected = useMemo(() => purchaseTicketList.some((ticket) => ticket.quantity > 0), [purchaseTicketList])

    // functions
    const handlePurchase = useCallback(() => {
        if (currentStep === "payment") {
            const form = formRef.current
            if (form) {
                const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
                form.dispatchEvent(submitEvent)
            }
            return
        }
        setCurrentStep("payment")

    }, [currentStep])

    const resetStates = useCallback(() => {
        setCurrentStep("tickets")
        setPurchaseTicketList([])
        setPromoCode("")
        setTermsAccepted(false)
    }, [setCurrentStep, setPurchaseTicketList, setPromoCode, setTermsAccepted])

    const handlePromoCode = useCallback(async () => {
        if (!promoCode || !selectedShow || !purchaseTicketList?.length) return
        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/validate-coupon`, {
                method: "POST",
                body: JSON.stringify({
                    "coupon_code": promoCode,
                    "show_id": selectedShow?.id,
                    "ticket_type_id": purchaseTicketList?.map((ticket) => ticket.ticket_id),
                    "total_amount": subtotal
                })
            })
            const { data } = await response.json()
            if (data.status) {
                showToast.success("Promo code applied!")
            } else {
                showToast.error("Invalid promo code")
            }
        } catch (error) {
            showToast.error("Error applying promo code")
        } finally {
            setIsLoading(false)
        }
    }, [promoCode, subtotal, selectedShow, purchaseTicketList])


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
            resetStates()
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
        purchaseTicketList,
        promoCode,
        setPromoCode,
        handlePromoCode,
        isLoading,
        discount,
        formRef,
        submitFormRef
    }
}