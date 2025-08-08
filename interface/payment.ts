export interface IPaymentFormData {
    cardNumber: string
    expiryDate: string
    securityCode: string
    country: string
    fullName: string
    email: string
    addressLine1: string
    addressLine2: string
    zipCode: string
    billingCountry: string
    state: string
    city: string
}

export interface IPaymentFormErrors {
    [key: string]: string
}

export interface IPaymentFormState {
    formData: IPaymentFormData
    errors: IPaymentFormErrors
    appliedCoupon: string
    isSubmitting: boolean
}

export interface IPaymentFormActions {
    updateFormData: (updates: Partial<IPaymentFormData>) => void
    setFormData: (formData: IPaymentFormData) => void
    updateErrors: (errors: IPaymentFormErrors) => void
    setAppliedCoupon: (appliedCoupon: string) => void
    resetForm: () => void
    setIsSubmitting: (isSubmitting: boolean) => void
}
