import toast from 'react-hot-toast'

export const showToast = {
  success: (message: string) => {
    toast.success(message)
  },
  error: (message: string) => {
    toast.error(message)
  },
  loading: (message: string) => {
    return toast.loading(message)
  },
  dismiss: (toastId: string) => {
    toast.dismiss(toastId)
  },
  custom: (message: string, options?: any) => {
    toast(message, options)
  }
} 