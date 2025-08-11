import { socialMediaLinks } from "@/constant/checkout"
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

export const formatDate = (dateString: string, timeString: string) => {
  const date = new Date(dateString);
  const time = timeString.split(':');
  
  return {
    month: date.toLocaleDateString('en-US', { month: 'short', weekday: 'short' }).toUpperCase(),
    day: date.getDate().toString().padStart(2, '0'),
    time: `${time[0]}:${time[1]} ${parseInt(time[0]) >= 12 ? 'PM' : 'AM'}`
  };
};
//check is the ref link is the social media link
export const isSocialMediaLink = (ref: string) => {
    return socialMediaLinks.some((link) => ref?.toLowerCase().includes(link))
}