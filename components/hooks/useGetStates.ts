import { useCountryState } from "@/store/useCountryState";
import { useEffect, useState } from "react";

export const useGetStates = () => {
    const { states, setStates } = useCountryState();
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
    return { states };
}