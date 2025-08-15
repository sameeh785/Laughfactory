import { IAppliedCouponApiResponse } from "./tickets"

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
    currentStep: "tickets" | "payment"
    appliedCouponApiResponse: IAppliedCouponApiResponse | null
}

export interface IPaymentFormActions {
    updateFormData: (updates: Partial<IPaymentFormData>) => void
    setFormData: (formData: IPaymentFormData) => void
    updateErrors: (errors: IPaymentFormErrors) => void
    setAppliedCoupon: (appliedCoupon: string) => void
    setAppliedCouponApiResponse: (appliedCouponApiResponse: IAppliedCouponApiResponse | null) => void
    setCurrentStep : (currentStep: "tickets" | "payment") => void
    resetForm: () => void
    setIsSubmitting: (isSubmitting: boolean) => void
}



// Types for Apple Pay
export interface IApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    supportedNetworks: string[];
    merchantCapabilities: string[];
    total: {
        label: string;
        amount: string;
        type?: 'final' | 'pending';
    };
    lineItems?: Array<{
        label: string;
        amount: string;
        type?: 'final' | 'pending';
    }>;
    requiredBillingContactFields?: string[];
    requiredShippingContactFields?: string[];
    shippingMethods?: Array<{
        label: string;
        amount: string;
        identifier: string;
        detail?: string;
    }>;
}

export interface IApplePayProps {
    disabled: boolean;
}

// Google Pay types
export interface IGooglePayPaymentRequest {
  apiVersion: number;
  apiVersionMinor: number;
  allowedPaymentMethods: IPaymentMethod[];
  merchantInfo: IMerchantInfo;
  transactionInfo: TransactionInfo;
  shippingAddressRequired?: boolean;
  shippingAddressParameters?: IShippingAddressParameters;
  emailRequired?: boolean;
  callbackIntents?: string[];
}

export interface IPaymentMethod {
  type: 'CARD' | 'PAYPAL';
  parameters: ICardParameters;
  tokenizationSpecification: ITokenizationSpecification;
}

export interface ICardParameters {
  allowedAuthMethods: string[];
  allowedCardNetworks: string[];
  billingAddressRequired?: boolean;
  billingAddressParameters?: IBillingAddressParameters;
}

export interface ITokenizationSpecification {
  type: 'PAYMENT_GATEWAY' | 'DIRECT';
  parameters: {
    gateway?: string;
    gatewayMerchantId?: string;
    [key: string]: any;
  };
}

export interface IMerchantInfo {
  merchantId?: string;
  merchantName: string;
}

export interface TransactionInfo {
  displayItems?: IDisplayItem[];
  countryCode: string;
  currencyCode: string;
  totalPriceStatus: 'NOT_CURRENTLY_KNOWN' | 'ESTIMATED' | 'FINAL';
  totalPrice: string;
  totalPriceLabel?: string;
}

export interface IDisplayItem {
  label: string;
  type: 'LINE_ITEM' | 'SUBTOTAL';
  price: string;
  status?: 'FINAL' | 'PENDING';
}

export interface IBillingAddressParameters {
  format?: 'FULL' | 'MIN';
  phoneNumberRequired?: boolean;
}

export interface IShippingAddressParameters {
  allowedCountryCodes?: string[];
  phoneNumberRequired?: boolean;
}

export interface IGooglePayProps {
  disabled: boolean;
}

export interface IState {
  id: string
  code: string
  name: string
}
