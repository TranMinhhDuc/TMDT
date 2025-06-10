import { useCallback, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

const useCart = () => {
  const { accessToken } = useContext(ShopContext);

  const getCart = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/v1/cart', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }, [accessToken]);

  return { getCart };
};

export default useCart;