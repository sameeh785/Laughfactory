import { useEffect } from "react";

const useLockBodyScroll = (isModalVisible: boolean) => {
  useEffect(() => {
    const body = document.body;

    if (isModalVisible) {
      body.style.position = "fixed";
    } else {
      body.style.position = "";
    }

    return () => {
      body.style.position = "";
    };
  }, [isModalVisible]);
};

export default useLockBodyScroll;
