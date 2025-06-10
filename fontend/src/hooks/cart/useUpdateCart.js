import { useCallback, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

const useUpdateCart = () => {
  const { accessToken } = useContext(ShopContext);

  const updateCart = useCallback(async (quantity, cartItemId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/v1/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }, [accessToken]);

  return { updateCart };
};

export default useUpdateCart;
