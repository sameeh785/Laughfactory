import { IPaymentFormData, IPaymentFormErrors } from "@/interface/payment"
import usePaymentFormStore from "@/store/usePaymentFormStore"
import { validateCardNumber, validateEmail, validateExpiryDate } from "@/utils/common"

export const useCheckout = (formRef: React.RefObject<HTMLFormElement>) => {
    const { formData, updateFormData, updateErrors, errors, setIsSubmitting } = usePaymentFormStore()

    const validateForm = (): boolean => {
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
    }

    const handleInputChange = (field: keyof IPaymentFormData, value: string) => {
        updateFormData({
            [field]: value
        })
        // Clear error when user starts typing
        if (errors[field]) {
            updateErrors({
                [field]: ""
            })
        }
    }

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, "")
        const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim()
        return formatted.substring(0, 19) // Max 16 digits + 3 spaces
    }

    const formatExpiryDate = (value: string) => {
        const cleaned = value.replace(/\D/g, "")
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
        }
        return cleaned
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        alert("submit")
        if (!validateForm()) return

        setIsSubmitting(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsSubmitting(false)
    }

    return {
        handleSubmit,
        handleInputChange,
        formatCardNumber,
        formatExpiryDate,
        formData,
        errors,
        submitForm: handleSubmit
    }
}