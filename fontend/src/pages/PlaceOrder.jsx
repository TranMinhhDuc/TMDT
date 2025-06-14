import React, { useContext, useEffect, useState } from 'react'
import { formatPrice } from '../utils/format.util';
import useCart from '../hooks/cart/useCart';
import { assets } from '../assets/assets';
import useCreateOrders from '../hooks/orders/useCreateOrders';

const PlaceOrder = () => {
  const {getCart} = useCart();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');

  const {createOrders} = useCreateOrders();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        const tmpCart = data.data.cart.map((item) => {
          return {
            productVariantId: item.productVariantId,
            quantity: item.quantity
          }
        })
        setTotalPrice(data.data.totalPrice);
        setCart(tmpCart);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const address = location + ', ' + district + ', ' + city;
      const result = await createOrders(customerName, address, paymentMethod, cart, totalPrice);
      console.log(result)
      if (paymentMethod === 'vnpay') {
         window.location.href = result.payUrl;
      } else if (paymentMethod === 'cash') {
        window.location.href = `http://localhost:5173/payment-result?paymentMethod=cash`
      }
    } catch (error) {
      console.log('lỗi thanh toán: ', error)
    }
  }

  return (
    <div className='flex flex-col sm:flex-row justify-center items-center gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'> 
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl'>Thông tin giao hàng</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-700' />
          </div>
        </div>
        <div className='flex gap-3'>
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type="text"
            name='full name'
            onChange={(e) => (setCustomerName(e.target.value))}
            placeholder='Họ và tên người nhận hàng'
            required
          />
        </div>
        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" name='full name' 
            placeholder='Địa chỉ' 
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" name='full name' 
            placeholder='Quận/Huyện' 
            onChange={(e) => setDistrict(e.target.value)}
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            name='full name' 
            placeholder='Tỉnh/Thành Phố' 
            onChange={(e) => setCity(e.target.value)}
          />

        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-semibold text-gray-800">
              Tổng cộng:
            </p>
            <p className="text-2xl font-bold text-black">
              {formatPrice(totalPrice)} VND
            </p>
          </div>

          <hr className="my-4 border-gray-500" />

          <div className="flex flex-col lg:flex-row gap-4 justify-center">
            <div 
              onClick={() => {
                setPaymentMethod('vnpay')
              }} 
              className="flex items-center gap-4 border p-4 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
              <div 
                className= {`w-4 h-4 border-2 border-gray-500 rounded-full ${paymentMethod === 'vnpay' ? `bg-green-700`: ``}`}></div>
              <img
                className="h-10 w-20 object-contain"
                src={assets.vnpay_icon} 
                alt="vnpay"
              />
            </div>

            <div 
              onClick={() => {
                setPaymentMethod('cash')
              }}
              className="flex items-center gap-4 border p-4 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
              <div 
              className={`w-4 h-4 border-2 border-gray-500 rounded-full ${paymentMethod === 'cash' ? `bg-green-700`: ``}`}></div>
              <p className="font-medium text-lg text-gray-700">Tiền mặt</p>
            </div>
          </div>

          <div className="text-right my-4">
            <button
              className={`py-3 px-8 rounded-lg transition duration-300 ease-in-out
                ${paymentMethod === null || location === '' || district === '' || city === '' || customerName === ''
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'}
              `}
              onClick= {(e) => handlePayment(e)}
              disabled={paymentMethod === null || location === '' || district === '' || city === '' || customerName === ''}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
