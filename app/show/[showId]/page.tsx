"use client";

import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import Button from "@/components/ui/Button";
import TicketList from "@/components/ShowList/TicketList";
import PaymentForm from "@/components/checkout/PaymentForm";
// import ApplePayButton from "@/components/checkout/ApplePayButton";
import { cn, formatDate } from "@/utils/common";
import { usePurchaseTicket } from "../../../components/hooks/usePurchaseTicket";
import { ITicketList } from "@/interface/tickets";
// import GooglePayButton from "@google-pay/button-react";
import ThankYou from "../../../components/checkout/ThankYou";
import { useEffect, useState } from "react";
import { useSelectedShowStore } from "@/store/useSelectedShowStore";
import Loader from "@/components/ui/Loader";

export default function PurchaseTicketModal({
  params,
}: {
  params: { showId: string };
}) {
  //hooks
  const { showId } = params;
  const { setSelectedShow } = useSelectedShowStore();
  const {
    currentStep,
    setCurrentStep,
    subtotal,
    hasTicketsSelected,
    termsAccepted,
    setTermsAccepted,
    handleCloseModal,
    selectedShow,
    handlePurchase,
    purchaseTicketList,
    promoCode,
    setPromoCode,
    appliedCouponApiResponse,
    formRef,
    submitFormRef,
    handlePromoCode,
    isLoading,
    isSubmitting,
    appliedCoupon,
  } = usePurchaseTicket();
  //state
  const [loading, setLoading] = useState(true);

  const fetchShow = async () => {
    if (showId) {
      try {
        setLoading(true);
        const response = await fetch(`/api/single-show/${showId}`);
        const { data : {show} } = await response.json();
        if (show) {
          setSelectedShow({
            title: show.title,
            description: show.description,
            image:
              show.image ||
              "https://cdn.laughfactory.com/images/liveshowimages/BAN0000001257.jpg",
            comedians: show.comedians.map((comedian: any) => ({
              name: comedian.name,
              image:
                comedian.image ||
                "https://cdn.laughfactory.com/images/comedians/com0000003819_big.jpg",
              url: comedian?.url || "",
            })),
            date: formatDate(show.date, show.start_time),
            dateId: show.date_id,
            id: show.id,
            is_sold_out: show.is_sold_out,
            alert_is_percentage: show.alert_is_percentage,
            alert_message: show.alert_message,
            alert_quantity: show.alert_quantity,
            thumbnail: show?.thumbnail_image || "",
            tags: show?.tags || [],
            show_after_sold_out: show?.show_after_sold_out || 0,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  //effects
  useEffect(() => {
    if (showId) {
      fetchShow();
    }
  }, [showId]);

  if (loading) {
    return (
      <div className="lg:col-span-2 flex justify-center items-center min-h-[200px]">
        <Loader size="lg" />
      </div>
    );
  }

  if(!selectedShow){
    return <div className="lg:col-span-2 flex justify-center items-center min-h-[200px] text-[16px] text-gray-950">
     Show with this id does not exist
  </div>
  }
  return <div
  className={cn(
    "relative w-full h-full bg-white",
    {
      "w-auto": currentStep === "thankyou"
    }
  )}
>
  {currentStep === "thankyou" ? (
    <ThankYou removeIcon={true}/>
  ) : (
    <div>
      <div
        className={cn("flex justify-between px-4", {
          "justify-between": currentStep === "payment",
          "justify-end": currentStep === "tickets",
        })}
      >
        {currentStep === "payment" && (
          <button
            onClick={() => {
              setTermsAccepted(false);
              setCurrentStep("tickets");
            }}
            className="m-3 hover:bg-gray-100 rounded-full transition-colors w-10 h-10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
        )}

      </div>
      <div className="py-6 px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Options */}
          {currentStep === "tickets" && <TicketList />}
          {currentStep === "payment" && (
            <PaymentForm
              formRef={formRef}
              submitFormRef={submitFormRef}
            />
          )}

          {/* Right Column - Order Summary */}
          <div className="space-y-6 text-gray-900 bg-gray-50 rounded-lg">
            {/* Promo Image */}
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src={
                  selectedShow?.thumbnail ||
                  "https://storage.googleapis.com/partner-portal-storage/ticketing/others/730HWInstagramjpg5c0f2b24-382b-40c5-9beb-0dcb6291017e.jpeg"
                }
                alt={selectedShow?.title || ""}
                className="m-auto rounded-lg mt-2 object-image-initial"
                width={224}
                height={300}
              />
            </div>

            {/* Order Summary */}
            <div className="rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-2 mb-4">
                {purchaseTicketList.map((option: ITicketList) => {
                  if (option.quantity === 0) return null;
                  const discount =
                    appliedCouponApiResponse?.applied_ticket_types?.find(
                      (ticket) =>
                        ticket.ticket_type_id === option.ticket_type_id
                    )?.discount_amount;
                  return (
                    <div
                      key={option.ticket_id}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {option.quantity} x {option.name}
                      </span>
                      <div>
                        <span
                          className={
                            discount ? "line-through text-gray-500" : ""
                          }
                        >
                          $
                          {(
                            parseFloat(option.price) * option.quantity
                          ).toFixed(2)}
                        </span>
                        <span>
                          {discount ? (
                            <span className="font-bold text-orange-500">
                              &nbsp;$
                              {(
                                parseFloat(option.price) *
                                  option.quantity -
                                discount
                              ).toFixed(2)}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                {appliedCouponApiResponse?.discount_applied &&
                  !appliedCouponApiResponse?.applied_ticket_types
                    ?.length && (
                    <div className="flex justify-between text-sm">
                      <span>Discount</span>
                      <span className="text-orange-500 font-bold">
                        $
                        {appliedCouponApiResponse?.discount_applied.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  )}
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fees</span>
                  <span>${(0.0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>USD ${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4 mt-4">
                {/* Promo Code Section */}
                {currentStep === "payment" && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Have a Promo Code?
                    </h4>
                    <div className="flex gap-2 flex-col md:flex-row">
                      <input
                        type="text"
                        placeholder="Enter your code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={promoCode}
                        disabled={!!appliedCoupon || isSubmitting}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button
                        className={cn(
                          "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed",
                          {
                            appliedCoupon: "bg-red-500 hover:bg-red-600",
                            isSubmitting: "cursor-not-allowed",
                          }
                        )}
                        size="sm"
                        disabled={
                          appliedCoupon
                            ? false
                            : !promoCode ||
                              isLoading.isApplyCouponCode ||
                              isSubmitting
                        }
                        onClick={handlePromoCode}
                      >
                        {appliedCoupon ? "Remove" : "Apply"}
                      </Button>
                    </div>
                  </div>
                )}
                {/* Terms and Conditions */}
                {currentStep === "payment" && (
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                      }}
                      checked={termsAccepted}
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs text-gray-700 leading-relaxed"
                    >
                      I accept Laugh Factory{" "}
                      <a
                        href="#"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Terms of Service
                      </a>{" "}
                      and that they will be processing this payment.
                    </label>
                  </div>
                )}
                <Button
                  className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                  size="lg"
                  onClick={handlePurchase}
                  disabled={
                    isSubmitting ||
                    !hasTicketsSelected ||
                    (currentStep === "payment" && !termsAccepted)
                  }
                >
                  {isSubmitting
                    ? "Processing..."
                    : currentStep === "tickets"
                    ? "Purchase"
                    : "Complete Purchase"}
                </Button>
                {/* {currentStep === "payment" && (
                                  <ApplePayButton
                                      disabled={
                                          !hasTicketsSelected ||
                                          (currentStep === "payment" && !termsAccepted)
                                      }
                                  />
                              )} */}
                {/* {currentStep === "payment" && <div className={cn({
                                  "pointer-events-none opacity-50 cursor-not-allowed": !termsAccepted || !hasTicketsSelected || isLoading.isPayingWithGoogle
                              })}>
                                  <GooglePayButton
                                      className="w-full"
                                      buttonType="short"
                                      environment="TEST"
                                      onClick={async (e) => {
                                          if (!validateForm(false)) {
                                              e.preventDefault()
                                          }
                                      }}
                                      paymentRequest={{
                                          apiVersion: 2,
                                          apiVersionMinor: 0,
                                          allowedPaymentMethods: [
                                              {
                                                  type: "CARD",
                                                  parameters: {
                                                      allowedAuthMethods: [
                                                          "PAN_ONLY",
                                                          "CRYPTOGRAM_3DS",
                                                      ],
                                                      allowedCardNetworks: ["MASTERCARD", "VISA"],
                                                  },
                                                  tokenizationSpecification: {
                                                      type: "PAYMENT_GATEWAY",
                                                      parameters: {
                                                          gateway: "authorizenet",
                                                          gatewayMerchantId: process.env.NEXT_PUBLIC_GOOGLE_GETEWAYMERCHANTID!,
                                                      },
                                                  },
                                              },
                                          ],
                                          merchantInfo: {
                                              merchantId: process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID!,
                                              merchantName: process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_NAME!,
                                          },
                                          transactionInfo: {
                                              totalPriceStatus: "FINAL",
                                              totalPriceLabel: "Total",
                                              totalPrice: (subtotal).toFixed(2),
                                              currencyCode: "USD",
                                              countryCode: "US",
                                          },
                                      }}
                                      onLoadPaymentData={(paymentRequest) => {
                                          onLoadPaymentData(paymentRequest);
                                      }}
                                  />
                              </div>
                              } */}
                {currentStep === "payment" && (
                  // Disclaimer Section
                  <div className="text-xs text-gray-600 space-y-2 mt-4 p-3 rounded-md">
                    <p>
                      Guests must be 21 or older, however each 21+ guest
                      may sponsor up to two guests aged 18–20.
                    </p>
                    <p>
                      All guests must present valid photo ID for entry
                      (government-issued driver's license or ID, passport,
                      tribal ID, military ID, or U.S. resident card).
                    </p>
                    <p>
                      A two-item minimum purchase per patron is required.
                    </p>
                    <p>
                      To find more information or to answer other commonly
                      asked questions, please visit our FAQ page at:{" "}
                      <a
                        href="https://www.laughfactory.com/hollywood/faqs"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Laugh Factory FAQ
                      </a>
                    </p>
                    <p>
                      Prices, performers, and schedule are subject to
                      change.
                    </p>
                    <p>Vouchers are not redeemable at the door.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
}
