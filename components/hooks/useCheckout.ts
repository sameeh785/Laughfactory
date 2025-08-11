import { IPaymentFormData, IPaymentFormErrors } from "@/interface/payment"
import usePaymentFormStore from "@/store/usePaymentFormStore"
import { isSearchEngineLink, isSocialMediaLink, validateCardNumber, validateEmail, validateExpiryDate } from "@/utils/common"
import { showToast } from "@/utils/toast"
import { useCallback } from "react"
import { useModalStore } from "@/store/useModalStore"
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore"
import { useSelectedShowStore } from "@/store/useSelectedShowStore"
import { ORDER_SOURCE } from "@/constant/checkout"
import { useSearchParams } from "next/navigation"

// Validation error messages
const VALIDATION_MESSAGES = {
    cardNumber: {
        required: "Card number is required",
        invalid: "Please enter a valid card number"
    },
    expiryDate: {
        required: "Expiry date is required",
        invalid: "Please enter a valid expiry date (MM/YY)"
    },
    securityCode: {
        required: "Security code is required",
        invalid: "Please enter a valid security code"
    },
    fullName: {
        required: "Full name is required"
    },
    email: {
        required: "Email is required",
        invalid: "Please enter a valid email address"
    },
    addressLine1: {
        required: "Address is required"
    },
    zipCode: {
        required: "Zip code is required"
    },
    state: {
        required: "State is required"
    },
    city: {
        required: "City is required"
    }
} as const

// Card formatting constants
const CARD_FORMAT = {
    MAX_LENGTH: 19, // 16 digits + 3 spaces
    GROUP_SIZE: 4
} as const

export const useCheckout = (formRef: React.RefObject<HTMLFormElement>) => {
    // Store hooks
    const { 
        formData, 
        updateFormData, 
        updateErrors, 
        errors, 
        setIsSubmitting, 
        appliedCoupon, 
        isSubmitting 
    } = usePaymentFormStore()
    
    const { subtotal, purchaseTicketList } = usePurchaseTicketsStore()
    const { selectedShow } = useSelectedShowStore()
    const { closeModal } = useModalStore()
    
    // URL parameters
    const searchParams = useSearchParams()
    const ref = searchParams.get("ref")
    const prID = searchParams.get("prID")

    // Validation functions
    const validateCardFields = useCallback((newErrors: IPaymentFormErrors): void => {
        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = VALIDATION_MESSAGES.cardNumber.required
        } else if (!validateCardNumber(formData.cardNumber)) {
            newErrors.cardNumber = VALIDATION_MESSAGES.cardNumber.invalid
        }

        if (!formData.expiryDate.trim()) {
            newErrors.expiryDate = VALIDATION_MESSAGES.expiryDate.required
        } else if (!validateExpiryDate(formData.expiryDate)) {
            newErrors.expiryDate = VALIDATION_MESSAGES.expiryDate.invalid
        }

        if (!formData.securityCode.trim()) {
            newErrors.securityCode = VALIDATION_MESSAGES.securityCode.required
        } else if (!/^\d{3,4}$/.test(formData.securityCode)) {
            newErrors.securityCode = VALIDATION_MESSAGES.securityCode.invalid
        }
    }, [formData])

    const validatePersonalInfo = useCallback((newErrors: IPaymentFormErrors): void => {
        if (!formData.fullName.trim()) {
            newErrors.fullName = VALIDATION_MESSAGES.fullName.required
        }

        if (!formData.email.trim()) {
            newErrors.email = VALIDATION_MESSAGES.email.required
        } else if (!validateEmail(formData.email)) {
            newErrors.email = VALIDATION_MESSAGES.email.invalid
        }
    }, [formData])

    const validateBillingInfo = useCallback((newErrors: IPaymentFormErrors): void => {
        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = VALIDATION_MESSAGES.addressLine1.required
        }

        if (!formData.zipCode.trim()) {
            newErrors.zipCode = VALIDATION_MESSAGES.zipCode.required
        }

        if (!formData.state.trim()) {
            newErrors.state = VALIDATION_MESSAGES.state.required
        }

        if (!formData.city.trim()) {
            newErrors.city = VALIDATION_MESSAGES.city.required
        }
    }, [formData])

    const validateForm = useCallback((): boolean => {
        const newErrors: IPaymentFormErrors = {}

        validateCardFields(newErrors)
        validatePersonalInfo(newErrors)
        validateBillingInfo(newErrors)

        updateErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [validateCardFields, validatePersonalInfo, validateBillingInfo, updateErrors])

    // Input handling functions
    const handleInputChange = useCallback((field: keyof IPaymentFormData, value: string) => {
        updateFormData({ [field]: value })
        
        // Clear error when user starts typing
        if (errors[field]) {
            updateErrors({ [field]: "" })
        }
    }, [updateFormData, errors, updateErrors])

    const formatCardNumber = useCallback((value: string): string => {
        const cleaned = value.replace(/\s/g, "")
        const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim()
        return formatted.substring(0, CARD_FORMAT.MAX_LENGTH)
    }, [])

    const formatExpiryDate = useCallback((value: string): string => {
        const cleaned = value.replace(/\D/g, "")
        if (cleaned.length >= 2) {
            return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
        }
        return cleaned
    }, [])

    // Data transformation functions
    const parseFullName = useCallback((fullName: string): { firstName: string; lastName: string } => {
        const nameParts = fullName.trim().split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        return { firstName, lastName }
    }, [])

    const formatExpirationDate = useCallback((expiryDate: string): string => {
        const [month, year] = expiryDate.split('/')
        return `20${year}-${month.padStart(2, '0')}`
    }, [])

    const buildBillingAddress = useCallback((formData: IPaymentFormData): string => {
        const baseAddress = formData.addressLine1
        const addressLine2 = formData.addressLine2 ? ` ${formData.addressLine2}` : ''
        return baseAddress + addressLine2
    }, [])

    const buildTicketsPayload = useCallback(() => {
        return purchaseTicketList?.map((ticket) => ({
            ticket_type_id: ticket.ticket_type_id,
            quantity: ticket.quantity,
            price: Number(ticket.price)
        }))
    }, [purchaseTicketList])

    const determineOrderSource = useCallback(() => {
        if (appliedCoupon) {
            return {
                order_source: ORDER_SOURCE.promo_code,
                coupon_code: appliedCoupon,
                promoter_id: null,
                referring_site: null
            }
        }
        
        if (prID) {
            return {
                order_source: ORDER_SOURCE.promoter,
                promoter_id: prID,
                referring_site: null
            }
        }
        
        if (ref && isSocialMediaLink(ref)) {
            return {
                order_source: ORDER_SOURCE.social,
                referring_site: ref,
                promoter_id: null
            }
        }
        
        if (ref && isSearchEngineLink(ref)) {
            return {
                order_source: ORDER_SOURCE.organic,
                referring_site: ref,
                promoter_id: null
            }
        }
        
        if (ref) {
            return {
                order_source: ORDER_SOURCE.referring_site,
                referring_site: ref,
                promoter_id: null
            }
        }
        
        return {
            order_source: ORDER_SOURCE.direct,
            referring_site: null,
            promoter_id: null
        }
    }, [appliedCoupon, prID, ref])

    const buildPaymentPayload = useCallback(() => {
        const { firstName, lastName } = parseFullName(formData.fullName)
        const expirationDate = formatExpirationDate(formData.expiryDate)
        const billingAddress = buildBillingAddress(formData)
        const orderSourceData = determineOrderSource()

        return {
            company_id: process.env.NEXT_PUBLIC_COMPANY_ID,
            amount: subtotal?.toFixed(2),
            cardNumber: formData.cardNumber.replace(/\s/g, ""),
            expirationDate,
            cardCode: formData.securityCode,
            show_id: selectedShow?.id,
            show_date_id: selectedShow?.dateId,
            affiliate_source: null,
            ...orderSourceData,
            billTo: {
                firstName,
                lastName,
                address: billingAddress,
                city: formData.city,
                state: formData.state,
                zip: formData.zipCode,
                country: formData.country,
                email: formData.email
            },
            tickets: buildTicketsPayload()
        }
    }, [
        formData, 
        subtotal, 
        selectedShow, 
        parseFullName, 
        formatExpirationDate, 
        buildBillingAddress, 
        determineOrderSource, 
        buildTicketsPayload
    ])

    const handlePaymentResponse = useCallback(async (response: Response) => {
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
    }, [closeModal])

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) return

        try {
            setIsSubmitting(true)
            
            const payload = buildPaymentPayload()
            
            const response = await fetch('/api/charge', {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            await handlePaymentResponse(response)

        } catch (error) {
            showToast.error("Payment failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }, [
        validateForm, 
        setIsSubmitting, 
        buildPaymentPayload, 
        handlePaymentResponse
    ])

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