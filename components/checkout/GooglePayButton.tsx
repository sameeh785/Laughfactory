import React, { useEffect, useState, useCallback } from 'react';
import Button from '../ui/Button';
import { IGooglePayPaymentRequest, IGooglePayProps, IPaymentMethod } from '@/interface/payment';
import { useHandleGooglePay } from '../hooks/useHandleGooglePay';



declare global {
  interface Window {
    google?: {
      payments: {
        api: {
          PaymentsClient: new (options: any) => any;
        };
      };
    };
  }
}

const GooglePayIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12.0014 2.40002C6.69901 2.40002 2.40143 6.69759 2.40143 12C2.40143 17.3024 6.69901 21.6 12.0014 21.6C17.3038 21.6 21.6014 17.3024 21.6014 12C21.6014 6.69759 17.3038 2.40002 12.0014 2.40002ZM12.0014 19.9091C7.63351 19.9091 4.09233 16.368 4.09233 12C4.09233 7.63214 7.63351 4.09097 12.0014 4.09097C16.3693 4.09097 19.9105 7.63214 19.9105 12C19.9105 16.368 16.3693 19.9091 12.0014 19.9091Z" fill="white"/>
    <path d="M9.85714 8.57143H14.1429V9.42857H9.85714V8.57143Z" fill="white"/>
    <path d="M9.85714 11.1429H14.1429V12H9.85714V11.1429Z" fill="white"/>
    <path d="M9.85714 13.7143H12V14.5714H9.85714V13.7143Z" fill="white"/>
  </svg>
);
const GooglePayButton: React.FC<IGooglePayProps> = ({
  disabled
}) => {
   const {isGooglePayLoaded, isGooglePayReady, isProcessing, handleGooglePayButtonClick} = useHandleGooglePay(disabled)
  if (!isGooglePayLoaded || !isGooglePayReady) {
    return null; // Don't render the button if Google Pay is not ready
  }

  return (
     <Button
            className={`w-full !bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed`}
            size="lg"
            onClick={handleGooglePayButtonClick}
            disabled={disabled || isProcessing}
        >
            <GooglePayIcon />
            {isProcessing ? "Processing..." : "Goodle Pay"}
        </Button>
  );
};



export default GooglePayButton;