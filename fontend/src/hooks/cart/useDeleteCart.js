import { useCallback, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

const useDeleteCart = () => {
  const { accessToken } = useContext(ShopContext);

  const deleteCart = useCallback(async (cartId, cartItemId) => {
    try {
      console.log('Deleting cart with ID:', cartId);
      const response = await fetch(`http://localhost:5001/api/v1/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ cartId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw error;
    }
  }, [accessToken]);

  return { deleteCart };
};

export default useDeleteCart;
