import usePaymentFormStore from "@/store/usePaymentFormStore"
import { useModalStore } from "@/store/useModalStore"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShowStore"
import { showToast } from "@/utils/toast"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { IAppliedCouponApiResponse } from "@/interface/tickets"

export const usePurchaseTicket = () => {
    // hooks
    const { isModalOpen, closeModal } = useModalStore()
    const { selectedShow } = useSelectedShowStore()
    const [currentStep, setCurrentStep] = useState<"tickets" | "payment">("tickets")
    const { purchaseTicketList,setPurchaseTicketList,setSubtotal} = usePurchaseTicketsStore()
    const formRef = useRef<HTMLFormElement>(null)
    const { resetForm, setAppliedCoupon, isSubmitting } = usePaymentFormStore()
    const submitFormRef = useRef<((e?: React.FormEvent) => void) | null>(null)

    // state
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [promoCode, setPromoCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [appliedCouponApiResponse, setAppliedCouponApiResponse] = useState<IAppliedCouponApiResponse | null>(null)

    // calculations
    const subtotal = useMemo(() => {
        const discount = appliedCouponApiResponse?.discount_applied ?? 0;
        const total = purchaseTicketList.reduce((sum, option) => {
            return sum + parseFloat(option.price) * option.quantity
        }, 0) - discount;
        return total > 0 ? total : 0;
    }, [purchaseTicketList, appliedCouponApiResponse]);
    const hasTicketsSelected = useMemo(() => purchaseTicketList.some((ticket) => ticket.quantity > 0), [purchaseTicketList]);

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
        setAppliedCoupon("")
        setTermsAccepted(false)
        setAppliedCouponApiResponse(null)
        resetForm()
    }, [setCurrentStep, setPurchaseTicketList, setPromoCode, setTermsAccepted, setAppliedCouponApiResponse, resetForm])


    const handlePromoCode = useCallback(async () => {
        if (!promoCode || !selectedShow || !purchaseTicketList?.length) return
        setIsLoading(true)
        try {
            const response = await fetch('/api/validate-coupon', {
                method: "POST",
                body: JSON.stringify({
                    "coupon_code": promoCode,
                    "show_id": selectedShow?.id,
                    "ticket_types": purchaseTicketList?.map((ticket) => {
                        return {
                            "ticket_type_id" : ticket.ticket_type_id,
                            "amount" : Number(ticket.price),
                            "quantity" : ticket.quantity
                        }
                    }),
                    "total_amount": subtotal
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const { data } = await response.json()
            if (data?.discount_applied) {
                setAppliedCoupon(promoCode)
                showToast.success("Promo code applied!")
                setAppliedCouponApiResponse(data)
            } else if (data?.error) {
                showToast.error(data?.error)
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

    useEffect(() => {
        setSubtotal(subtotal)
        if(currentStep === "tickets"){
            setPromoCode("")
        }
    }, [subtotal,currentStep])

    useEffect(() => {
        console.log("referror",document.referrer)
    }, [])

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
        appliedCouponApiResponse,
        formRef,
        submitFormRef,
        isSubmitting
    }
}