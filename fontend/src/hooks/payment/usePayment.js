// usePayment.js
import { useCallback } from "react";

const usePayment = () => {
    const vnpayPayment = useCallback(async (vnp_orderId, resultCode) => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/payment/vnpay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vnp_orderId, resultCode }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error success payment:', error);
            throw error;
        }
    }, []);

    return vnpayPayment; // ❗ Trả về trực tiếp
};

export default usePayment;
