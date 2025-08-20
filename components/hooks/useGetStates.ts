import { useCountryState } from "@/store/useCountryState";
import usePaymentFormStore from "@/store/usePaymentFormStore";
import { useEffect } from "react";

export const useGetStates = () => {
    const { states, setStates } = useCountryState();
    const {updateFormData} = usePaymentFormStore()
    const fetchStates = async () => {
        const response = await fetch(`/api/getState`);
        const {data} = await response.json();
        if(data?.length > 0) {
            setStates(data);
            updateFormData({state: data[0].id})
        }
        else {
            setStates([]);
        }
    }
    useEffect(() => {
        if (states.length === 0) {
            fetchStates();
        }
    }, []);
    return { states };
}