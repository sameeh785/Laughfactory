import { IGooglePayPaymentRequest, IPaymentMethod } from "@/interface/payment";
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useHandleGooglePay = (disabled: boolean) => {

    const [isGooglePayReady, setIsGooglePayReady] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [paymentsClient, setPaymentsClient] = useState<any>(null);
    const [isGooglePayLoaded, setIsGooglePayLoaded] = useState<boolean>(false);
    //hooks
    const { subtotal, purchaseTicketList } = usePurchaseTicketsStore()
    // constants
    const environment = 'TEST';
    const merchantName = 'Test Merchant';
    const merchantId = '1234567890';
    const allowedAuthMethods = ['CARD'];
    const allowedCardNetworks = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'JCB', 'RUPAY', 'MAESTRO', 'DINERS_CLUB'];
    const billingAddressRequired = true;
    const gatewayMerchantId = 'your-stripe-merchant-id';
    const gateway = 'stripe';


    //functions
    const loadGooglePayScript = () => {
        if (window.google?.payments?.api) {
            setIsGooglePayLoaded(true);
            initializeGooglePay();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://pay.google.com/gp/p/js/pay.js';
        script.onload = () => {
            setIsGooglePayLoaded(true);
            initializeGooglePay();
        };
        script.onerror = () => {
            console.error('Failed to load Google Pay script');
            toast.error('Failed to load Google Pay');
        };
        document.body.appendChild(script);
    };

    const initializeGooglePay = useCallback(() => {
        if (!window.google?.payments?.api) {
            console.error('Google Pay API not available');
            return;
        }

        try {
            const client = new window.google.payments.api.PaymentsClient({
                environment,
                merchantInfo: {
                    merchantName,
                    merchantId
                }
            });

            setPaymentsClient(client);
            checkGooglePayReadiness(client);
        } catch (error) {
            console.error('Failed to initialize Google Pay:', error);
            toast.error('Failed to initialize Google Pay');
        }
    }, [environment, merchantName, merchantId]);

    const checkGooglePayReadiness = (client: any) => {
        const isReadyToPayRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [getCardPaymentMethod()]
        };

        client.isReadyToPay(isReadyToPayRequest)
            .then((response: any) => {
                if (response.result) {
                    console.log('Google Pay is ready');
                    setIsGooglePayReady(true);
                } else {
                    console.log('Google Pay is not ready:', response);
                    setIsGooglePayReady(false);
                }
            })
            .catch((err: any) => {
                console.error('Error checking Google Pay readiness:', err);
                setIsGooglePayReady(false);
            });
    };

    const formatAmount = (value: number): string => {
        return (value / 100).toFixed(2);
    };

    const getCardPaymentMethod = (): IPaymentMethod => {
        return {
            type: 'CARD',
            parameters: {
                allowedAuthMethods,
                allowedCardNetworks,
                billingAddressRequired,
                billingAddressParameters: billingAddressRequired ? {
                    format: 'FULL',
                    phoneNumberRequired: false
                } : undefined
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    gateway,
                    gatewayMerchantId
                }
            }
        };
    };

    const handlePaymentSuccess = (result: any) => {
        console.log('Payment successful:', result);
        toast.success('Payment successful');
    }

    const createPaymentRequest = (): IGooglePayPaymentRequest => {
        const formattedDisplayItems = purchaseTicketList.map(item => ({
            label: item.name,
            type: 'LINE_ITEM' as const,
            price: formatAmount(Number(item.price) * 100),
            status: 'FINAL' as const
        }));

        return {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [getCardPaymentMethod()],
            merchantInfo: {
                merchantId,
                merchantName
            },
            transactionInfo: {
                displayItems: formattedDisplayItems.length > 0 ? formattedDisplayItems : undefined,
                countryCode: 'US',
                currencyCode: 'USD',
                totalPriceStatus: 'FINAL',
                totalPrice: formatAmount(subtotal * 100),
                totalPriceLabel: 'Total'
            },
            shippingAddressRequired: false,
            emailRequired: true
        };
    };

    const handleGooglePayButtonClick = () => {
        if (!isGooglePayReady || disabled || isProcessing || !paymentsClient) {
            return;
        }

        setIsProcessing(true);

        const paymentDataRequest = createPaymentRequest();

        paymentsClient.loadPaymentData(paymentDataRequest)
            .then(async (paymentData: any) => {
                try {
                    console.log('Google Pay payment data:', paymentData);

                    // Process the payment with your backend
                    const result = await processPayment(paymentData);
                    setIsProcessing(false);
                    handlePaymentSuccess(result);
                } catch (error) {
                    console.error('Payment processing failed:', error);
                    setIsProcessing(false);
                    toast('Payment processing failed');
                }
            })
            .catch((err: any) => {
                console.error('Google Pay error:', err);
                setIsProcessing(false);

                if (err.statusCode === 'CANCELED') {
                    toast.error('Payment processing failed');
                } else {
                    toast.error(`Google Pay error: ${err.statusMessage || 'Unknown error'}`);
                }
            });
    };

    const processPayment = async (paymentData: any): Promise<any> => {
        try {
            // This should call your backend endpoint that processes the Google Pay payment
            const response = await fetch('/api/google-pay/process-payment', {
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
    // Load Google Pay API
    useEffect(() => {
        loadGooglePayScript();
    }, []);
    return {
        isGooglePayLoaded,
        isGooglePayReady,
        isProcessing,
        handleGooglePayButtonClick
    }
}