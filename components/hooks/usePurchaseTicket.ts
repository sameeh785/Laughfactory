import usePaymentFormStore from "@/store/usePaymentFormStore";
import { useModalStore } from "@/store/useModalStore";
import { usePurchaseTicketsStore } from "@/store/usePurchaseTicketsStore";
import { useSelectedShowStore } from "@/store/useSelectedShowStore";
import { showToast } from "@/utils/toast";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IAppliedCouponApiResponse } from "@/interface/tickets";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCheckout } from "./useCheckout";

export const usePurchaseTicket = () => {
  // hooks
  const { isModalOpen, closeModal, openModal } = useModalStore();
  const { selectedShow } = useSelectedShowStore();
  const { buildPaymentPayload, validateForm } = useCheckout();
  const { purchaseTicketList, setPurchaseTicketList, setSubtotal, setTickets } =
    usePurchaseTicketsStore();
  const {
    resetForm,
    setAppliedCoupon,
    appliedCoupon,
    isSubmitting,
    currentStep,
    setCurrentStep,
  } = usePaymentFormStore();
  const formRef = useRef<HTMLFormElement>(null);
  const submitFormRef = useRef<((e?: React.FormEvent) => void) | null>(null);
  const searchParams = useSearchParams();
  const showID = searchParams.get("showID");
  const router = useRouter();
  // state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState({
    isApplyCouponCode: false,
    isPayingWithGoogle: false,
  });
  const [appliedCouponApiResponse, setAppliedCouponApiResponse] =
    useState<IAppliedCouponApiResponse | null>(null);

  // calculations
  const subtotal = useMemo(() => {
    const discount = appliedCouponApiResponse?.discount_applied ?? 0;
    const total =
      purchaseTicketList.reduce((sum, option) => {
        return sum + parseFloat(option.price) * option.quantity;
      }, 0) - discount;
    return total > 0 ? total : 0;
  }, [purchaseTicketList, appliedCouponApiResponse]);
  const hasTicketsSelected = useMemo(
    () => purchaseTicketList.some((ticket) => ticket.quantity > 0),
    [purchaseTicketList]
  );

  // functions
  const handlePurchase = useCallback(() => {
    if (currentStep === "payment") {
      const form = formRef.current;
      if (form) {
        const submitEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        form.dispatchEvent(submitEvent);
      }
      return;
    }
    setCurrentStep("payment");
  }, [currentStep]);

  const resetStates = useCallback(() => {
    setCurrentStep("tickets");
    setPurchaseTicketList([]);
    setTickets([]);
    setPromoCode("");
    setAppliedCoupon("");
    setTermsAccepted(false);
    setAppliedCouponApiResponse(null);
    resetForm();
  }, [
    setCurrentStep,
    setPurchaseTicketList,
    setPromoCode,
    setTermsAccepted,
    setAppliedCouponApiResponse,
    resetForm,
  ]);

  const handleCloseModal = useCallback(() => {
    router.replace("/");
    closeModal();
    resetStates();
  }, [router, closeModal, resetStates]);

  const removePromoCode = useCallback(() => {
    setPromoCode("");
    setAppliedCoupon("");
    setAppliedCouponApiResponse(null);
    showToast.success("Promo code removed!");
  }, [setPromoCode, setAppliedCoupon, setAppliedCouponApiResponse]);

  const handlePromoCode = useCallback(async () => {
    if (!promoCode || !selectedShow || !purchaseTicketList?.length) return;
    setIsLoading({
      ...isLoading,
      isApplyCouponCode: true,
    });
    try {
      if (appliedCoupon) {
        removePromoCode();
        return;
      }
      const response = await fetch("/api/validate-coupon", {
        method: "POST",
        body: JSON.stringify({
          coupon_code: promoCode,
          show_id: selectedShow?.id,
          ticket_types: purchaseTicketList?.map((ticket) => {
            return {
              ticket_type_id: ticket.ticket_type_id,
              amount: Number(ticket.price),
              quantity: ticket.quantity,
            };
          }),
          total_amount: subtotal,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { data } = await response.json();
      if (data?.discount_applied) {
        setAppliedCoupon(promoCode);
        showToast.success("Promo code applied!");
        setAppliedCouponApiResponse(data);
      } else if (data?.error) {
        showToast.error(data?.error);
      }
    } catch (error) {
      showToast.error("Error applying promo code");
      removePromoCode();
    } finally {
      setIsLoading({
        ...isLoading,
        isApplyCouponCode: false,
      });
    }
  }, [promoCode, subtotal, selectedShow, purchaseTicketList]);

  const onLoadPaymentData = useCallback(
    async (paymentRequest: Record<string, any>) => {
      try {
        setIsLoading({
          ...isLoading,
          isPayingWithGoogle: true,
        });
        toast.loading("Payment in progress");
        const checkoutFormPayload = buildPaymentPayload(false);
        const payload = {
          ...checkoutFormPayload,
          description: paymentRequest?.paymentMethodData?.description,
          paymentMethodData: {
            tokenizationData: {
              ...(paymentRequest?.paymentMethodData?.tokenizationData || {}),
            },
          },
          info: {
            cardNetwork: paymentRequest?.paymentMethodData?.info?.cardNetwork,
            cardDetails: paymentRequest?.paymentMethodData?.info?.cardDetails,
          },
        };
        const response = await fetch("/api/googlePay", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const { data } = await response.json();
        if (data?.success) {
          resetStates();
          closeModal();
          toast.success("Ticket purchased successfully");
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Error in paying with google");
      } finally {
        setIsLoading({
          ...isLoading,
          isApplyCouponCode: true,
        });
      }
    },
    [subtotal, buildPaymentPayload]
  );

  // effects
  useEffect(() => {
    setSubtotal(subtotal);
    if (currentStep === "tickets") {
      setPromoCode("");
    }
  }, [subtotal, currentStep]);

  useEffect(() => {
    if (showID) {
      openModal();
    }
  }, []);

  return {
    currentStep,
    setCurrentStep,
    subtotal,
    hasTicketsSelected,
    termsAccepted,
    setTermsAccepted,
    selectedShow,
    closeModal,
    handleCloseModal,
    isModalOpen,
    handlePurchase,
    purchaseTicketList,
    promoCode,
    setPromoCode,
    handlePromoCode,
    isLoading,
    appliedCouponApiResponse,
    formRef,
    submitFormRef,
    isSubmitting,
    showID,
    appliedCoupon,
    onLoadPaymentData,
    validateForm,
  };
};
