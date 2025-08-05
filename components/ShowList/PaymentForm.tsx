"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

interface PaymentFormData {
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

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void
  onBack: () => void
  total: number
}

interface FormErrors {
  [key: string]: string
}

export default function PaymentForm({ onSubmit, onBack, total }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    country: "United States",
    fullName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    zipCode: "",
    billingCountry: "United States",
    state: "",
    city: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "Pakistan",
    "India",
    "Brazil",
  ]

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, "")
    return /^\d{13,19}$/.test(cleaned)
  }

  const validateExpiryDate = (expiryDate: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!regex.test(expiryDate)) return false

    const [month, year] = expiryDate.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    const expYear = Number.parseInt(year)
    const expMonth = Number.parseInt(month)

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false
    }

    return true
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Card validation
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Please enter a valid card number"
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)"
    }

    if (!formData.securityCode.trim()) {
      newErrors.securityCode = "Security code is required"
    } else if (!/^\d{3,4}$/.test(formData.securityCode)) {
      newErrors.securityCode = "Please enter a valid security code"
    }

    // Personal info validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Billing info validation
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required"
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim()
    return formatted.substring(0, 19) // Max 16 digits + 3 spaces
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onSubmit(formData)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 text-gray-900">
      {/* Payment Information */}
      <div className="space-y-4 bg-gray-50 rounded-lg p-4">
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
            <div className="absolute right-3 top-2 flex gap-1">
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
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
            />
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

      {/* Action Buttons
      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back to Tickets
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : `Complete Purchase - $${total.toFixed(2)}`}
        </Button>
      </div> */}
    </form>
  )
}
