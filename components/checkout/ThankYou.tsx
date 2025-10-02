import { CheckCircle, X } from "lucide-react";
// import Button from "../ui/Button";
import { useModalStore } from "@/store/useModalStore"
import usePaymentFormStore from "@/store/usePaymentFormStore";
import { useSelectedShowStore } from "@/store/useSelectedShowStore";
import { cn } from "@/utils/common";

export default function ThankYou({ removeIcon }: { removeIcon?: boolean }) {
    // hooks
    const { closeModal } = useModalStore()
    const { setCurrentStep, downloadTicketsUrl } = usePaymentFormStore()
    const {selectedShow} =  useSelectedShowStore()

    // functions
    const onClickCloseModal = () => {
        closeModal()
        setCurrentStep("tickets")
    }
    // const onDownloadTickets = () => {
    //     const a = document.createElement("a")
    //     a.href = downloadTicketsUrl
    //     a.download = "tickets.pdf"
    //     a.target = "_blank"
    //     a.click()
    // }
    return (

        <div className={cn("bg-white rounded-2xl shadow-xl text-center space-y-6 w-full h-full", {
            "!w-full h-full justify-center items-center flex": removeIcon,
            "max-w-lg": !removeIcon,
        })}>
           <div>
             {/* close icon */}
            {!removeIcon && <div className="flex justify-end">
                <button
                    onClick={onClickCloseModal}
                    className="m-3 hover:bg-gray-100 rounded-full transition-colors w-6 h-6 flex items-center justify-center mr-4"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>
            }
            {/* Icon */}
            <CheckCircle className="text-orange-500 mx-auto !mt-0" size={64}/>
            {/* Title */}
           <div className="p-6 !mt-0">
           <h1 className="text-3xl font-bold text-gray-800">
                🎉 Thank You for Your Purchase!
            </h1>

            {/* Message */}
            <p className="text-gray-600 my-3">
                Your ticket for the <span className="font-semibold text-orange-500">{selectedShow?.title}</span> has been booked successfully.
                Get ready for the show full of laughter! 😂
            </p>
            <p className="text-gray-600">Your tickets have been sent to your email.</p>
            {/* <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-200 transform hover:scale-105 outline-none" onClick={onDownloadTickets}>
                Download Tickets
            </Button> */}
           </div>
           </div> 
        </div>
    );
}
