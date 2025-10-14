import { useCountryState } from "@/store/useCountryState";
import usePaymentFormStore from "@/store/usePaymentFormStore";
import { useEffect, useState } from "react";

    export const useSettingDescription = () => {
    const [settingDescription, setSettingDescription] = useState("");
    const fetchSettingDescription = async () => {
        const response = await fetch(`/api/settingDescription`);
        const {data} = await response.json();
        if(data?.settings?.frontend_text?.length > 0) {
            setSettingDescription(data?.settings?.frontend_text);
        }
        else {
            setSettingDescription("");
        }
    }
    useEffect(() => {
        if (settingDescription === "") {
            fetchSettingDescription();
        }
    }, []);

    return { settingDescription };
}