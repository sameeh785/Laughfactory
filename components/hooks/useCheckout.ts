import { IPaymentFormData, IPaymentFormErrors } from "@/interface/payment"
import usePaymentFormStore from "@/store/usePaymentFormStore"
import { isSocialMediaLink, validateCardNumber, validateEmail, validateExpiryDate } from "@/utils/common"
import { showToast } from "@/utils/toast"
import { useCallback } from "react"
import { useModalStore } from "@/store/useModalStore"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShowStore"
import { ORDER_SOURCE } from "@/constant/checkout"
import { useSearchParams } from "next/navigation"

export const useCheckout = (formRef: React.RefObject<HTMLFormElement>) => {
    // hooks
    const { formData, updateFormData, updateErrors, errors, setIsSubmitting, appliedCoupon, isSubmitting } = usePaymentFormStore()
    const { subtotal, purchaseTicketList } = usePurchaseTicketsStore()
    const { selectedShow } = useSelectedShowStore()
    const { closeModal } = useModalStore()
    const searchParams = useSearchParams()
    const ref = searchParams.get("ref")

    //functions
    const validateForm = useCallback((): boolean => {
        const newErrors: IPaymentFormErrors = {}

        // Card validation
        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = "Card number is required"
        } else if (!validateCardNumber(formData.cardNumber)) {
            newErrors.cardNumber = "Please enter a valid card number"
        }

        if (!formData.expiryDate.trim()) {
            newErrors.expiryDate = "Expiry date is required"
        } else if (!validateExpiryDate(formData.expiryDate)) {
            newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
        }

        if (!formData.securityCode.trim()) {
            newErrors.securityCode = "Security code is required"
        } else if (!/^\d{3,4}$/.test(formData.securityCode)) {
            newErrors.securityCode = "Please enter a valid security code"
        }

        // Personal info validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Billing info validation
        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = "Address is required"
        }

        if (!formData.zipCode.trim()) {
            newErrors.zipCode = "Zip code is required"
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required"
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required"
        }

        updateErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData, updateErrors, errors])

    const handleInputChange = useCallback((field: keyof IPaymentFormData, value: string) => {
        updateFormData({
            [field]: value
        })
        // Clear error when user starts typing
        if (errors[field]) {
            updateErrors({
                [field]: ""
            })
        }
    }, [updateFormData, errors, updateErrors])

    const formatCardNumber = useCallback((value: string) => {
        const cleaned = value.replace(/\s/g, "")
        const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim()
        return formatted.substring(0, 19) // Max 16 digits + 3 spaces
    }, [])

    const formatExpiryDate = useCallback((value: string) => {
        const cleaned = value.replace(/\D/g, "")
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
        }
        return cleaned
    }, [])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            setIsSubmitting(true)

            // Parse full name into first and last name
            const nameParts = formData.fullName.trim().split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''

            // Format expiry date from MM/YY to YYYY-MM
            const [month, year] = formData.expiryDate.split('/')
            const expirationDate = `20${year}-${month.padStart(2, '0')}`

            const payload : any = {
                amount: subtotal?.toFixed(2),
                cardNumber: formData.cardNumber.replace(/\s/g, ""),
                expirationDate: expirationDate,
                cardCode: formData.securityCode,
                billTo: {
                    firstName: firstName,
                    lastName: lastName,
                    address: formData.addressLine1 + (formData.addressLine2 ? ` ${formData.addressLine2}` : ''),
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zipCode,
                    country: formData.country,
                    email: formData.email
                },
                tickets: purchaseTicketList?.map((ticket) => {
                    return {
                        "show_id": selectedShow?.id,
                        "show_date_id": selectedShow?.dateId,
                        "ticket_type_id": ticket.ticket_type_id,
                        "quantity": ticket.quantity,
                        "price": Number(ticket.price)
                    }
                })
            }

            if(appliedCoupon){
                payload.coupon_code = appliedCoupon
                payload.order_source = ORDER_SOURCE.promo_code
            } else if(ref && isSocialMediaLink(ref)){
                payload.order_source = ORDER_SOURCE.social
                payload.referring_site = ref
            }
            else{
                payload.order_source = ORDER_SOURCE.direct
            }
            const response = await fetch('/api/charge', {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Payment failed')
            }

            const result = await response.json()
            if (result?.status) {
                showToast.success("Tickets purchased successfully")
                closeModal()
            } else {
                showToast.error(result?.message)
            }

        } catch (error) {
            showToast.error("Payment failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }, [validateForm, setIsSubmitting, formData, subtotal, appliedCoupon])

    return {
        handleSubmit,
        handleInputChange,
        formatCardNumber,
        formatExpiryDate,
        formData,
        errors,
        submitForm: handleSubmit,
        isSubmitting
    }
}