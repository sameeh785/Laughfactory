import React, { useEffect, useState } from 'react';

// Types for Apple Pay
interface ApplePayPaymentRequest {
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

interface ApplePayProps {
  merchantId: string;
  amount: number;
  label: string;
  currencyCode?: string;
  countryCode?: string;
  lineItems?: Array<{
    label: string;
    amount: number;
  }>;
  onPaymentSuccess: (paymentResult: any) => void;
  onPaymentError: (error: string) => void;
  onPaymentCancel?: () => void;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    ApplePaySession: any;
  }
}

const ApplePayButton: React.FC<ApplePayProps> = ({
  merchantId,
  amount,
  label,
  currencyCode = 'USD',
  countryCode = 'US',
  lineItems = [],
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  className = '',
  disabled = false
}) => {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    checkApplePayAvailability();
  }, []);

  const checkApplePayAvailability = () => {
    // Check if we're in a supported environment
    if (typeof window === 'undefined') {
      setIsApplePayAvailable(false);
      return;
    }

    // Log for debugging
    console.log('ApplePaySession available:', !!window.ApplePaySession);
    console.log('User agent:', navigator.userAgent);
    console.log('Is HTTPS:', window.location.protocol === 'https:');

    if (window.ApplePaySession) {
      try {
        const canMakePayments = window.ApplePaySession.canMakePayments();
        console.log('Can make payments:', canMakePayments);
        setIsApplePayAvailable(canMakePayments);
      } catch (error) {
        console.error('Error checking Apple Pay availability:', error);
        setIsApplePayAvailable(false);
      }
    } else {
      console.log('ApplePaySession not available. Possible reasons:');
      console.log('- Not using Safari/WebKit browser');
      console.log('- Not on Apple device');
      console.log('- Not served over HTTPS');
      console.log('- Browser version too old');
      setIsApplePayAvailable(false);
    }
  };

  const formatAmount = (value: number): string => {
    return (value / 100).toFixed(2);
  };

  const createPaymentRequest = (): ApplePayPaymentRequest => {
    const formattedLineItems = lineItems.map(item => ({
      label: item.label,
      amount: formatAmount(item.amount),
      type: 'final' as const
    }));

    return {
      countryCode,
      currencyCode,
      supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label,
        amount: formatAmount(amount),
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
          merchantId
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
          amount,
          currency: currencyCode
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
          onPaymentError('Merchant validation failed');
        }
      };

      session.onpaymentmethodselected = (event: any) => {
        // Handle payment method selection if needed
        const total = paymentRequest.total;
        session.completePaymentMethodSelection(total, []);
      };

      session.onshippingmethodselected = (event: any) => {
        // Handle shipping method selection if needed
        const total = paymentRequest.total;
        session.completeShippingMethodSelection(
          window.ApplePaySession.STATUS_SUCCESS,
          total,
          []
        );
      };

      session.onshippingcontactselected = (event: any) => {
        // Handle shipping contact selection if needed
        const total = paymentRequest.total;
        session.completeShippingContactSelection(
          window.ApplePaySession.STATUS_SUCCESS,
          [],
          total,
          []
        );
      };

      session.onpaymentauthorized = async (event: any) => {
        try {
          const paymentResult = await processPayment(event.payment);
          session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
          setIsProcessing(false);
          onPaymentSuccess(paymentResult);
        } catch (error) {
          console.error('Payment processing failed:', error);
          session.completePayment(window.ApplePaySession.STATUS_FAILURE);
          setIsProcessing(false);
          onPaymentError('Payment processing failed');
        }
      };

      session.oncancel = () => {
        setIsProcessing(false);
        onPaymentCancel?.();
      };

      session.begin();
    } catch (error) {
      console.error('Failed to start Apple Pay session:', error);
      setIsProcessing(false);
      onPaymentError('Failed to start Apple Pay session');
    }
  };

  if (!isApplePayAvailable) {
    // Show debug info in development
    if (process.env.NODE_ENV === 'development') {
      return (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px', 
          fontSize: '14px',
          color: '#666'
        }}>
          Apple Pay not available. Check console for details.
        </div>
      );
    }
    return null; // Don't render anything in production
  }

  return (
    <button
      type="button"
      className={`apple-pay-button ${className} ${disabled || isProcessing ? 'disabled' : ''}`}
      onClick={handleApplePayButtonClick}
      disabled={disabled || isProcessing}
      style={{
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: disabled || isProcessing ? 'not-allowed' : 'pointer',
        opacity: disabled || isProcessing ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '44px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...applePayButtonStyles
      }}
    >
      {isProcessing ? (
        <span>Processing...</span>
      ) : (
        <>
          <ApplePayIcon />
          <span style={{ marginLeft: '8px' }}>Pay with Apple Pay</span>
        </>
      )}
    </button>
  );
};

// Apple Pay icon component
const ApplePayIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.078 23.55c-.473-.316-.893-.703-1.244-1.15-.383-.463-.738-.95-1.064-1.454-.766-1.12-1.365-2.345-1.78-3.636-.5-1.502-.743-2.94-.743-4.347 0-1.57.34-2.94 1.002-4.09.49-.9 1.22-1.653 2.1-2.182.85-.53 1.84-.82 2.84-.84.35 0 .73.05 1.13.15.29.08.64.21 1.07.37.55.21.85.32.95.32.085 0 .23-.04.436-.31.194-.25.4-.44.618-.569.245-.138.496-.708.751-.934.302-.268.728-.552 1.277-.851.56-.307 1.14-.458 1.74-.458.68 0 1.33.18 1.95.54.48.28.885.65 1.225 1.12-.49.28-.935.65-1.34 1.12-.49.58-.735 1.24-.735 1.98 0 .68.18 1.29.54 1.83.315.47.728.86 1.24 1.17-.12.317-.252.627-.395.93-.325.69-.696 1.35-1.112 1.98-.4.61-.873 1.94-1.416 2.116-.29.094-.7.04-1.23-.16-.375-.14-.753-.21-1.134-.21-.406 0-.796.07-1.17.21-.26.098-.72.52-1.018.52-.094 0-.373-.04-.84-.12-.65-.11-1.31-.34-1.97-.69zm5.682-18.54c.9-1.048 1.35-2.291 1.35-3.73 0-.187-.012-.375-.037-.562-.9.037-1.687.343-2.363.918-.563.473-1.026 1.15-1.388 2.032-.231.547-.347 1.098-.347 1.653 0 .175.031.35.093.481.063.032.156.05.281.05.793 0 1.456-.263 1.988-.788.563-.556.563-.556.423-1.054z"/>
  </svg>
);

// Apple Pay button styles
const applePayButtonStyles = {
  background: 'linear-gradient(135deg, #000 0%, #333 100%)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
  }
};

// Usage example component with debugging
export const ApplePayExample: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // Collect debug information
    const getApplePayDebugInfo = () => {
      const info = [];
      info.push(`User Agent: ${navigator.userAgent}`);
      info.push(`Protocol: ${window.location.protocol}`);
      info.push(`Host: ${window.location.host}`);
      info.push(`ApplePaySession available: ${!!window.ApplePaySession}`);
      info.push(`Platform: ${navigator.platform}`);
      info.push(`Is macOS: ${navigator.userAgent.includes('Mac')}`);
      info.push(`Is iOS: ${/iPad|iPhone|iPod/.test(navigator.userAgent)}`);
      info.push(`Safari version: ${navigator.userAgent.match(/Version\/([0-9._]+)/)?.[1] || 'Unknown'}`);
      
      // Check Touch ID support (this will only work if ApplePaySession exists)
      if (window.ApplePaySession) {
        try {
          const canMakePayments = window.ApplePaySession.canMakePayments();
          console.log(window.ApplePaySession,"window.ApplePaySession")
          info.push(`Can make payments ===> ${canMakePayments}`);
          
          if (!canMakePayments) {
            info.push('');
            info.push('❌ Apple Pay not ready - likely causes:');
            info.push('• No payment cards added to Apple Pay (most common)');
            info.push('• Touch ID not enabled for Apple Pay');
            info.push('• Apple Pay disabled in System Settings');
          }
          
          if (window.ApplePaySession.canMakePaymentsWithActiveCard) {
            info.push(`Has active cards: checking...`);
          }
        } catch (e : any) {
          info.push(`Error checking payments: ${e.message}`);
        }
      } else {
        info.push('ApplePaySession not available - possible causes:');
        info.push('• Touch ID not set up or not available on this Mac');
        info.push('• Apple Pay not configured in System Settings');
        info.push('• No payment cards added to Apple Pay');
        info.push('• Safari version too old');
        info.push('• MacBook lid is closed (if using built-in Touch ID)');
      }
      
      return info.join('\n');
    };

    setDebugInfo(getApplePayDebugInfo());
  }, []);

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
    alert('Payment successful!');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Payment failed: ${error}`);
  };

  const handlePaymentCancel = () => {
    console.log('Payment cancelled');
    alert('Payment cancelled');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Apple Pay Integration Example</h2>
      
      {/* Debug information */}
      <details style={{ marginBottom: '20px', fontSize: '12px' }}>
        <summary>Debug Information</summary>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap',
          marginTop: '10px'
        }}>
          {debugInfo}
        </pre>
      </details>

      <div style={{ marginTop: '20px' }}>
        <ApplePayButton
          merchantId="merchant.com.yourapp.payments"
          amount={2999} // $29.99 in cents
          label="Your Store Purchase"
          currencyCode="USD"
          countryCode="US"
          lineItems={[
            { label: "Product 1", amount: 1999 },
            { label: "Shipping", amount: 500 },
            { label: "Tax", amount: 500 }
          ]}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          onPaymentCancel={handlePaymentCancel}
        />
        
        {!window.ApplePaySession && (
          <div style={{ 
            marginTop: '10px', 
            padding: '12px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Apple Pay not available.</strong><br/>
            ApplePaySession API not found.
          </div>
        )}
        
        {window.ApplePaySession && !window.ApplePaySession.canMakePayments() && (
          <div style={{ 
            marginTop: '10px', 
            padding: '12px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Apple Pay setup required:</strong><br/>
            <ol style={{ marginTop: '8px', marginBottom: '0', paddingLeft: '20px' }}>
              <li><strong>Add a payment card:</strong> System Settings → Wallet & Apple Pay → Add card</li>
              <li><strong>Enable Touch ID:</strong> System Settings → Touch ID & Password → "Use Touch ID for Apple Pay"</li>
              <li><strong>Verify setup:</strong> Check "Allow Payments on Mac" is enabled</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplePayButton;