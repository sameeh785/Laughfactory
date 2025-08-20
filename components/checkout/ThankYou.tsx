import { CheckCircle, X } from "lucide-react";
import Button from "../ui/Button";
import { useModalStore } from "@/store/useModalStore"
import usePaymentFormStore from "@/store/usePaymentFormStore";

export default function ThankYou() {
    const { closeModal } = useModalStore()
    const { setCurrentStep } = usePaymentFormStore()
    const onClickCloseModal = () => {
        closeModal()
        setCurrentStep("tickets")
    }
    return (

        <div className="bg-white rounded-2xl shadow-xl pb-8 max-w-lg text-center space-y-6">
            {/* close icon */}
            <div className="flex justify-end">
                <button
                    onClick={onClickCloseModal}
                    className="m-3 hover:bg-gray-100 rounded-full transition-colors w-6 h-6 flex items-center justify-center mr-4"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>
            {/* Icon */}
            <CheckCircle className="text-orange-500 m-auto" size={64}/>

            {/* Title */}
           <div className="px-6">
           <h1 className="text-3xl font-bold text-gray-800">
                🎉 Thank You for Your Purchase!
            </h1>

            {/* Message */}
            <p className="text-gray-600">
                Your ticket for the <span className="font-semibold text-orange-500">Comedy Show</span> has been booked successfully.
                Get ready for a night full of laughter! 😂
            </p>
           </div>


            <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-200 transform hover:scale-105 outline-none" onClick={onClickCloseModal}>
                Download Tickets
            </Button>
        </div>
    );
}
