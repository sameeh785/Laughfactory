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
    useEffect(() => {
     if(states?.length){
        updateFormData({state: states[0].id})
     }
    },[states])
    return { states };
}