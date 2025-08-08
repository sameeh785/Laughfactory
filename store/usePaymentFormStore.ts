import { create } from "zustand"
import { IPaymentFormData, IPaymentFormState, IPaymentFormActions, IPaymentFormErrors } from "@/interface/payment"

const initialFormData: IPaymentFormData = {
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    country: "United States",
    fullName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    zipCode: "",
    billingCountry: "United States",
    state: "",
    city: "",
}

const usePaymentFormStore = create<IPaymentFormState & IPaymentFormActions>((set) => ({
    formData: initialFormData,
    errors: {},
    appliedCoupon: "",
    setAppliedCoupon: (appliedCoupon: string) => set({ appliedCoupon }),
    isSubmitting: false,
    setIsSubmitting: (isSubmitting: boolean) => 
        set({ isSubmitting }),

    updateFormData: (updates: Partial<IPaymentFormData>) => 
        set((state) => ({
            formData: { ...state.formData, ...updates }
        })),

    setFormData: (formData: IPaymentFormData) => 
        set({ formData }),

    updateErrors: (errors: IPaymentFormErrors) => 
        set((state) => ({
            errors: { ...state.errors, ...errors }
        })),

    resetForm: () => 
        set({ formData: initialFormData }),
}))

export default usePaymentFormStore
    