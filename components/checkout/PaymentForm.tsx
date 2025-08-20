"use client"

import React from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { countries } from "@/constant/countries"
import { useCheckout } from "../hooks/useCheckout"

interface PaymentFormProps {
  formRef: React.RefObject<HTMLFormElement>
  submitFormRef?: React.MutableRefObject<((e?: React.FormEvent) => void) | null>
}

export default function PaymentForm({formRef, submitFormRef }: PaymentFormProps) {
  const { handleSubmit, handleInputChange, formatCardNumber, formatExpiryDate, formData, errors, submitForm, states, appliedCoupon, subtotal } = useCheckout()
  console.log(formData,"formData")
  // Pass the submit function to the ref if provided
  React.useEffect(() => {
    if (submitFormRef) {
      submitFormRef.current = (e?: React.FormEvent) => {
        if (e) {
          submitForm(e)
        } else {
          // Call submitForm without event - it will handle the submission properly
          submitForm({} as React.FormEvent)
        }
      }
    }
  }, [submitForm, submitFormRef])

  return (
    <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 text-gray-900" ref={formRef}>
      {/* Payment Information */}
      {appliedCoupon && subtotal === 0 ? null : <div className="space-y-4 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card number</label>
          <div className="relative">
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
              placeholder="1234 1234 1234 1234"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="absolute right-3 top-2 gap-1 hidden sm:flex">
             <Image src="/master.svg" alt="Mastercard" className="h-5" width={20} height={30} />
             <Image src="/visa.svg" alt="Visa" className="h-5" width={20} height={30} />
             <Image src="/amex.svg" alt="Amex" className="h-5" width={20} height={30} />
             <Image src="/discover.svg" alt="Discover" className="h-5" width={20} height={30} />
            </div>
          </div>
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry date</label>
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
              placeholder="MM / YY"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.expiryDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
          </div>

          {/* Security Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Security code</label>
            <div className="relative">
              <input
                type="text"
                value={formData.securityCode}
                onChange={(e) => handleInputChange("securityCode", e.target.value.replace(/\D/g, "").substring(0, 4))}
                placeholder="CVC"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.securityCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {/* <div className="absolute right-3 top-2">
                <img src="/placeholder.svg?height=20&width=30" alt="CVC" className="h-5" />
              </div> */}
            </div>
            {errors.securityCode && <p className="text-red-500 text-sm mt-1">{errors.securityCode}</p>}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <div className="relative">
            <select
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Amex, Discover, Mastercard and Visa all accepted. Final item price includes a surcharge of 2.94% of the item
          price to cover credit card service fees.
        </p>
      </div>
      }

      {/* Delivery and Security */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Delivery and Security</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* Billing Info */}
      <div className="space-y-4 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900">Billing Info</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
          <input
            type="text"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange("addressLine1", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              errors.addressLine1 ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
          <input
            type="text"
            value={formData.addressLine2}
            onChange={(e) => handleInputChange("addressLine2", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Zip code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.zipCode ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <div className="relative">
              <select
                value={formData.billingCountry}
                onChange={(e) => handleInputChange("billingCountry", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select
              value={formData?.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              {states?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
        </div>
      </div>
    </form>
  )
}
