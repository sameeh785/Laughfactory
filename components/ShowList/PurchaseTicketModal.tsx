"use client";

import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import Button from "@/components/ui/Button";
import TicketList from "@/components/ShowList/TicketList";
import PaymentForm from "@/components/checkout/PaymentForm";
// import ApplePayButton from "@/components/checkout/ApplePayButton";
import { cn } from "@/utils/common";
import { usePurchaseTicket } from "../hooks/usePurchaseTicket";
import { ITicketList } from "@/interface/tickets";
// import GooglePayButton from "@google-pay/button-react";
import ThankYou from "../checkout/ThankYou";
import useLockBodyScroll from "../hooks/useBodyScrollLock";
import { useModalStore } from "@/store/useModalStore";
import { useSettingDescription } from "../hooks/useSettingDescription";
import RichTextDisplay from "./RenderHtml";

export default function PurchaseTicketModal() {
  const { isModalOpen } = useModalStore();
  const {
    currentStep,
    setCurrentStep,
    subtotal,
    hasTicketsSelected,
    termsAccepted,
    setTermsAccepted,
    setPromotionalOffers,
    promotionalOffers,
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
  const { settingDescription } = useSettingDescription();
  useLockBodyScroll(isModalOpen);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />
      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto",
          {
            "w-auto": currentStep === "thankyou",
          }
        )}
      >
        {currentStep === "thankyou" ? (
          <ThankYou />
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
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className={`m-3 hover:bg-gray-100 rounded-full transition-colors w-10 h-10 flex items-center justify-center ${
                  isSubmitting ? "cursor-not-allowed" : ""
                }`}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
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
                        const appliedCouponDiscount = appliedCouponApiResponse?.applied_ticket_types?.find(
                          (ticket) =>
                            ticket.ticket_type_id === option.ticket_type_id
                        )?.discount_amount;
                        let discount = 0;
                        if(appliedCouponDiscount) {
                          discount = appliedCouponDiscount;
                        }
                        else if(option.discount) {
                          discount = parseFloat(option.discount.amount);
                        }
                        
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
                        <span>Discount</span>
                        <span>
                          {appliedCouponApiResponse
                            ? `$${appliedCouponApiResponse?.discount_applied.toFixed(
                                2
                              )}`
                            : purchaseTicketList.filter((ticket) => ticket.quantity > 0).some((ticket) => ticket.discount) ? `$${purchaseTicketList.filter((ticket) => ticket.quantity > 0).reduce((sum, ticket) => sum + (parseFloat(ticket.discount?.amount || "0") || 0), 0).toFixed(2)}` : "$0.00"}
                        </span>
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
                        <div>
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
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              id="promotionalOffers"
                              className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                              onChange={(e) => {
                                setPromotionalOffers(e.target.checked);
                              }}
                              checked={promotionalOffers}
                            />
                            <label
                              htmlFor="promotionalOffers"
                              className="text-xs text-gray-700 leading-relaxed"
                            >
                             I’d like to receive promotional offers and updates.
                            </label>
                          </div>
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
                          <RichTextDisplay htmlContent={settingDescription} className="text-xs text-gray-600 space-y-2 rounded-md bg-transparent !p-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
