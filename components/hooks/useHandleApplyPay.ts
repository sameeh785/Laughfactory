import { useModalStore } from "@/store/useModalStore";
import { useResetStoreState } from "./useResetStoreState";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IApplePayPaymentRequest } from "@/interface/payment";
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore";

export const useHandleApplyPay = (disabled: boolean) => {
    const [isApplePayAvailable, setIsApplePayAvailable] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { closeModal } = useModalStore()
    const { purchaseTicketList, subtotal } = usePurchaseTicketsStore()
    const { resetStoreState } = useResetStoreState()

    const handlePaymentSuccess = () => {
        toast.success("Tickets purchased successfully");
        closeModal()
        resetStoreState()
    }
    const checkApplePayAvailability = () => {
        // Check if we're in a supported environment
        if (typeof window === 'undefined') {
            setIsApplePayAvailable(false);
            return;
        }
        if (window.ApplePaySession) {
            try {
                const canMakePayments = window.ApplePaySession.canMakePayments();
                setIsApplePayAvailable(canMakePayments);
            } catch (error) {
                console.error('Error checking Apple Pay availability:', error);
                setIsApplePayAvailable(false);
            }
        } else {
            setIsApplePayAvailable(false);
        }
    };

    const formatAmount = (value: number): string => {
        return (value / 100).toFixed(2);
    };

    const createPaymentRequest = (): IApplePayPaymentRequest => {
        const formattedLineItems = purchaseTicketList.map(item => ({
            label: item.name,
            amount: formatAmount(Number(item.price) * 100),
            type: 'final' as const
        }));

        return {
            countryCode: 'US',
            currencyCode: 'USD',
            supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
            merchantCapabilities: ['supports3DS'],
            total: {
                label: 'Laugh Factory',
                amount: formatAmount(subtotal * 100),
                type: 'final'
            },
            lineItems: formattedLineItems.length > 0 ? formattedLineItems : undefined,
            requiredBillingContactFields: ['postalAddress', 'name'],
            requiredShippingContactFields: []
        };
    };

    const validateMerchant = async (validationURL: string): Promise<any> => {
        try {
            // This should call your backend endpoint that handles merchant validation
            const response = await fetch('/api/apple-pay/validate-merchant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    validationURL,
                    merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID
                }),
            });

            if (!response.ok) {
                throw new Error('Merchant validation failed');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Failed to validate merchant');
        }
    };

    const processPayment = async (paymentData: any): Promise<any> => {
        try {
            // This should call your backend endpoint that processes the payment
            const response = await fetch('/api/apple-pay/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentData,
                    amount: subtotal,
                    currency: 'USD'
                }),
            });

            if (!response.ok) {
                throw new Error('Payment processing failed');
            }

            return await response.json();
        } catch (error) {
            throw new Error('Failed to process payment');
        }
    };

    const handleApplePayButtonClick = () => {
        if (!isApplePayAvailable || disabled || isProcessing) {
            return;
        }

        setIsProcessing(true);

        try {
            const paymentRequest = createPaymentRequest();
            const session = new window.ApplePaySession(3, paymentRequest);

            session.onvalidatemerchant = async (event: any) => {
                try {
                    const merchantSession = await validateMerchant(event.validationURL);

                    session.completeMerchantValidation(merchantSession);
                } catch (error) {
                    console.error('Merchant validation failed:', error);
                    session.abort();
                    setIsProcessing(false);
                    toast.error('Merchant validation failed');
                }
            };

            session.onpaymentmethodselected = (event: any) => {
                // Handle payment method selection if needed
                const total = paymentRequest.total;
                session.completePaymentMethodSelection(total, []);
            };

            // session.onshippingmethodselected = (event: any) => {
            //     // Handle shipping method selection if needed
            //     const total = paymentRequest.total;
            //     session.completeShippingMethodSelection(
            //         window.ApplePaySession.STATUS_SUCCESS,
            //         total,
            //         []
            //     );
            // };

            // session.onshippingcontactselected = (event: any) => {
            //     // Handle shipping contact selection if needed
            //     const total = paymentRequest.total;
            //     session.completeShippingContactSelection(
            //         window.ApplePaySession.STATUS_SUCCESS,
            //         [],
            //         total,
            //         []
            //     );
            // };

            session.onpaymentauthorized = async (event: any) => {
                try {
                    const paymentResult = await processPayment(event.payment);
                    session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
                    setIsProcessing(false);
                    handlePaymentSuccess();
                } catch (error) {
                    console.error('Payment processing failed:', error);
                    session.completePayment(window.ApplePaySession.STATUS_FAILURE);
                    setIsProcessing(false);
                    toast.error('Payment processing failed');
                }
            };

            session.oncancel = () => {
                setIsProcessing(false);
                toast.error('Payment cancelled');
            };

            session.begin();
        } catch (error) {
            console.error('Failed to start Apple Pay session:', error);
            setIsProcessing(false);
            toast.error('Failed to start Apple Pay session');
        }
    };



    useEffect(() => {
        checkApplePayAvailability();
    }, []);
    return { handleApplePayButtonClick, isProcessing, isApplePayAvailable }
}

export default useHandleApplyPay