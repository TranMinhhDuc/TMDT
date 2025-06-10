import { useCallback, useContext } from "react"
import { ShopContext } from "../../context/ShopContext"

const useCreateOrders = () => {
    const {accessToken} = useContext(ShopContext);

    const createOrders = useCallback( async (address, paymentMethod, cart, totalPrice) => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({address, paymentMethod, cart, totalPrice})
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating cart:', error)
            throw error
        }
    }, [accessToken]);

    return {createOrders};
}

export default useCreateOrders;