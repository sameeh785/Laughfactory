import { searchEngineLinks, socialMediaLinks } from "@/constant/checkout"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, "")
    return /^\d{13,19}$/.test(cleaned)
}

export const validateExpiryDate = (expiryDate: string): boolean => {
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

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Helper function to format date
export const formatDate = (date: string, time: string) => {
    // Parse the ISO date string
    const dateObj = new Date(date)
    const month = dateObj.toLocaleDateString('en-US', { month: 'long' })
    const day = dateObj.getDate()
    const year = dateObj.getFullYear()

    // Format time to 12-hour format with AM/PM
    const formatTime = (timeStr: string) => {
        // Remove any extra spaces and convert to uppercase
        const cleanTime = timeStr.trim().toUpperCase()

        // If already in 12-hour format with AM/PM, return as is
        if (cleanTime.includes('AM') || cleanTime.includes('PM')) {
            return cleanTime
        }

        // If in 24-hour format, convert to 12-hour
        if (cleanTime.includes(':')) {
            const [hours, minutes] = cleanTime.split(':')
            const hour = parseInt(hours)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
            return `${displayHour}${minutes ? `:${minutes}` : ''} ${ampm}`
        }

        // If just a number, assume it's hours in 24-hour format
        const hour = parseInt(cleanTime)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        return `${displayHour} ${ampm}`
    }

    return `${month} ${day}, ${year} at ${formatTime(time)}`
}

//check is the ref link is the social media link
export const isSocialMediaLink = (ref: string) => {
    return socialMediaLinks.some((link) => ref?.toLowerCase().includes(link))
}
//check is the ref link is the search engine link
export const isSearchEngineLink = (ref: string) => {
    return searchEngineLinks.some((link) => ref?.toLowerCase().includes(link))
}