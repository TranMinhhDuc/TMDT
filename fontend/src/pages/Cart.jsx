import React, { useContext, useEffect } from 'react'
import useCart from '../hooks/cart/useCart';
import { formatPrice } from '../utils/format.util';
import {assets} from '../assets/assets';
import useDeleteCart from '../hooks/cart/useDeleteCart';
import Message from '../component/Message';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const {getCart} = useCart();
  const {deleteCart} = useDeleteCart();
  const [cart, setCart] = React.useState(null);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [tmpMessage, setTmpMessage] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (tmpMessage) {
      const timeout = setTimeout(() => {
        setTmpMessage(null);
      }, 3000); 

      return () => clearTimeout(timeout);
    }
  }, [tmpMessage]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data.data.cart);
        setTotalPrice(data.data.totalPrice);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [getCart]);

  const handleDeleteItem = async (cartId, cartItemId) => {
    try {
      const deleteData = await deleteCart(cartId, cartItemId);
      setTmpMessage({
          message: deleteData.message,
          time: Date.now()
        });

        
      const updateData = await getCart();
      setCart(updateData.data.cart);
      setTotalPrice(updateData.data.totalPrice);
    } catch (error) {
      setDeleteResult('Failed to delete item from cart');
      console.error('Error deleting item from cart:', deleteCart);
    }
  }

  return (
    <div className='border-t pt-14'>
      <div >
        {cart && cart.length !== 0 ? 
          <div>
            <div className='text-2xl mb-3'>
              <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>Giỏ Hàng</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-700' />
              </div>
            </div>

            <div>
              {
                cart.map((items) => (
                  <div
                    key={items.cartItemId}
                    className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
                  >
                    <div className='flex items-center gap-6'>
                      <img className="w-16 sm:w-20" src={items.path} alt="Product Image" />
                      <div>
                        <p className="text-xs sm:text-lg font-medium">{items.name}</p>
                        <div className="flex items-center gap-5 mt-2">
                          <p>{formatPrice(items.price)} vnd</p>
                          <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{items.size}</p>
                           <span
                              className='w-5 h-5 rounded-full border border-gray-300'
                              style={{ backgroundColor: items.color || '#fff' }}
                              title={items.color}
                            ></span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <p className="text-sm sm:text-base font-medium">Số lượng:</p>
                      <span className="min-w-[40px] px-3 py-1 text-center border border-gray-300 rounded-md bg-white text-sm sm:text-base">
                        {items.quantity}
                      </span>
                    </div>

                    <img
                      className='w-4 mr-4 sm:w-5 cursor-pointer'
                      src={assets.bin_icon}
                      alt="Delete"
                      onClick={() => handleDeleteItem(items.cartId, items.cartItemId)}
                    />
                  </div>
                ))
              }
              
            {tmpMessage && <Message message={tmpMessage.message} />}
            </div>
            <div className='mt-8 text-right'>
              <p className="text-xl font-semibold mb-4">
              Tổng cộng: {formatPrice(totalPrice)} VND
              </p>
              <button
                className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors"
                onClick={() => {navigate('/payment')
                }}
              >
                Thanh toán
              </button>
            </div>
          </div> : 
          <div className='text-2xl mb-3'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
              <p className='prata-regular text-3xl'>Giỏ hàng của bạn trống</p>
              <hr className='border-none h-[1.5px] w-8 bg-gray-700' />
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Cart
