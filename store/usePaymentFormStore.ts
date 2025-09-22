import { create } from "zustand"
import { IPaymentFormData, IPaymentFormState, IPaymentFormActions, IPaymentFormErrors } from "@/interface/payment"
import { IAppliedCouponApiResponse } from "@/interface/tickets"

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
    phoneNumber: "",
}

const usePaymentFormStore = create<IPaymentFormState & IPaymentFormActions>((set) => ({
    formData: initialFormData,
    errors: {},
    currentStep: "tickets",
    promoCode: "",
    appliedCoupon: "",
    appliedCouponApiResponse: null,
    downloadTicketsUrl: "",
    setDownloadTicketsUrl: (downloadTicketsUrl: string) => set({ downloadTicketsUrl }),
    setAppliedCoupon: (appliedCoupon: string) => set({ appliedCoupon }),
    setAppliedCouponApiResponse: (appliedCouponApiResponse: IAppliedCouponApiResponse | null) => set({ appliedCouponApiResponse }),
    setCurrentStep : (currentStep: "tickets" | "payment" | "thankyou") => set({ currentStep }),
    isSubmitting: false,
    setPromoCode: (promoCode: string) => 
        set({ promoCode }),
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
        set({ formData: initialFormData, errors : {}, promoCode : "" }),
}))

export default usePaymentFormStore
    