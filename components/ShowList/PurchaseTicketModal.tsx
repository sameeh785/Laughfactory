"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowLeft, X } from "lucide-react"
import Button from "../ui/Button"
import { useModalStore } from "@/store/useModalStore"
import { useSelectedShowStore } from "@/store/selectedShow"
import TicketList from "./TicketList"
import PaymentForm from "./PaymentForm"
import { cn } from "@/utils/common"

const ticketOptions = [
    {
        id: "1",
        name: "Ticket",
        price: 10,
        fees: 1,
        description: "Ticket description",
        timeSlot: "Time slot",
    },
    {
        id: "2",
        name: "Ticket",
        price: 10,
        fees: 1,
        description: "Ticket description",
        timeSlot: "Time slot",
    },
]

export default function PurchaseTicketModal() {
    // hooks
    const { isModalOpen, closeModal } = useModalStore()
    const { selectedShow } = useSelectedShowStore()
    const [currentStep, setCurrentStep] = useState<"tickets" | "payment">("tickets")
    // functions
    const handlePurchase = () => {
        setCurrentStep("payment")
    }
    const handlePaymentSubmit = (paymentData: any) => {
        alert(`Payment successful! Total: $${total.toFixed(2)}`)
        closeModal()
        // Reset states
        setCurrentStep("tickets")
        setQuantities(ticketOptions.reduce((acc, option) => ({ ...acc, [option.id]: 0 }), {}))
    }

    // state
    const [quantities, setQuantities] = useState<Record<string, number>>(
        ticketOptions.reduce((acc, option) => ({ ...acc, [option.id]: 0 }), {}),
    )
    const [termsAccepted, setTermsAccepted] = useState(false)
    // calculations
    const subtotal = ticketOptions.reduce((sum, option) => {
        return sum + option.price * quantities[option.id]
    }, 0)

    const totalFees = ticketOptions.reduce((sum, option) => {
        return sum + option.fees * quantities[option.id]
    }, 0)

    const total = subtotal + totalFees

    const hasTicketsSelected = Object.values(quantities).some((qty) => qty > 0)

    // effects
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isModalOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal()
            }
        }

        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [isModalOpen, closeModal])
    if (!isModalOpen || !selectedShow) return <></>

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeModal} />
            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <div className={cn("flex justify-between px-4", {
                    "justify-between": currentStep === "payment",
                    "justify-end": currentStep === "tickets",
                })}>
                    {currentStep === "payment" && (
                        <button onClick={() => setCurrentStep("tickets")} className="m-3 hover:bg-gray-100 rounded-full transition-colors w-10 h-10 flex items-center justify-center">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                    )}
                    <button
                        onClick={closeModal}
                        className="m-3 hover:bg-gray-100 rounded-full transition-colors w-10 h-10 flex items-center justify-center"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="py-6 px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Ticket Options */}
                        {currentStep === "tickets" && (
                            <TicketList quantities={quantities} setQuantities={setQuantities} ticketOptions={ticketOptions} />
                        )}
                        {currentStep === "payment" && (
                            <PaymentForm onSubmit={handlePaymentSubmit} onBack={() => setCurrentStep("tickets")} total={total} />
                        )}

                        {/* Right Column - Order Summary */}
                        <div className="space-y-6 text-gray-900 bg-gray-50 rounded-lg">
                            {/* Promo Image */}
                            <div className="relative h-64 rounded-lg overflow-hidden">
                                <Image src={"https://storage.googleapis.com/partner-portal-storage/ticketing/others/730HWInstagramjpg5c0f2b24-382b-40c5-9beb-0dcb6291017e.jpeg"} alt={selectedShow?.title || ""} className="object-contain m-auto rounded-lg mt-2" width={224} height={300} />
                            </div>

                            {/* Order Summary */}
                            <div className="rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                                <div className="space-y-2 mb-4">
                                    {ticketOptions.map((option) => {
                                        const qty = quantities[option.id]
                                        if (qty === 0) return null

                                        return (
                                            <div key={option.id} className="flex justify-between text-sm">
                                                <span>
                                                    {qty} x {option.name}
                                                </span>
                                                <span>${(option.price * qty).toFixed(2)}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Fees</span>
                                        <span>${totalFees.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Taxes</span>
                                        <span>$0.00</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>USD ${total.toFixed(2)}</span>
                                    </div>
                                </div>


                                <div className="space-y-4 mt-4">
                                    {/* Promo Code Section */}
                                    {
                                        currentStep === "payment" && <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Have a Promo Code?</h4>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter your code"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                />
                                                <Button
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm"
                                                    size="sm"
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    {/* Terms and Conditions */}
                                    {currentStep === "payment" && <div className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                            onChange={(e) => {
                                                setTermsAccepted(e.target.checked)
                                            }}
                                        />
                                        <label htmlFor="terms" className="text-xs text-gray-700 leading-relaxed">
                                            I accept Punchup's Fan{" "}
                                            <a href="#" className="text-blue-600 underline hover:text-blue-800">
                                                Terms of Service
                                            </a>{" "}
                                            and that they will be processing this payment.
                                        </label>
                                    </div>
                                    }
                                    <Button
                                        className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                                        size="lg"
                                        onClick={handlePurchase}
                                        disabled={!hasTicketsSelected || currentStep === "payment" && !termsAccepted}
                                    >
                                        {currentStep === "tickets" ? "Purchase" : "Complete Purchase"}
                                    </Button>
                                    {
                                        currentStep === "payment" && (
                                            // Disclaimer Section
                                            <div className="text-xs text-gray-600 space-y-2 mt-4 p-3 rounded-md">
                                                <p>Guests must be 21 or older, however each 21+ guest may sponsor up to two guests aged 18–20.</p>
                                                <p>All guests must present valid photo ID for entry (government-issued driver's license or ID, passport, tribal ID, military ID, or U.S. resident card).</p>
                                                <p>A two-item minimum purchase per patron is required.</p>
                                                <p>
                                                    To find more information or to answer other commonly asked questions, please visit our FAQ page at:{" "}
                                                    <a href="https://www.laughfactory.com/hollywood/faqs" className="text-blue-600 underline hover:text-blue-800">
                                                        https://www.laughfactory.com/hollywood/faqs
                                                    </a>
                                                </p>
                                                <p>Prices, performers, and schedule are subject to change.</p>
                                                <p>Vouchers are not redeemable at the door.</p>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
