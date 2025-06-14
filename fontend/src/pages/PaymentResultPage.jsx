import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import usePayment from '../hooks/payment/usePayment';

const PaymentResultPage = () => {
  const location = useLocation();
  const [vnpResultCode, setVnpResultCode] = useState(null);
  const [vnp_orderId, setVnp_orderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);
  const vnpayPayment = usePayment();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(searchParams.entries());

    setVnpResultCode(params.vnp_ResponseCode);
    setVnp_orderId(params.vnp_OrderInfo);
    setPaymentMethod(params.paymentMethod);
  }, [location.search]);

  useEffect(() => {
    if (vnp_orderId && vnpResultCode) {
      setPaymentMethod('vnpay');
      setIsSuccess(vnpResultCode === '00');

      const data = vnpayPayment(vnp_orderId, vnpResultCode);
      console.log(data)
    }
  }, [vnp_orderId, vnpResultCode]);

  return (
    <div>
      {
        paymentMethod === 'vnpay' && (
          <div className='flex flex-col items-center w-[95%] sm:max-w-150 m-auto mt-14 gap-4 text-gray-700'>
              <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                  <p className='prata-regular text-3xl'>{isSuccess ? 'Đã thanh toán thành công' : 'Thanh toán không thành công'}</p>
                  <hr className='border-none h-[1.5px] w-8 bg-gray-700' />
              </div>
              <p className='text-lg'>{isSuccess ? 'Bạn đã đặt hàng thành công' : 'Thanh toán thất bại hoặc thiếu thông tin'}</p>
          </div>
        )
      }

      {
        paymentMethod === 'cash' && (
          <div className='flex flex-col items-center w-[95%] sm:max-w-150 m-auto mt-14 gap-4 text-gray-700'>
              <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                  <p className='prata-regular text-3xl'>Đã đặt hàng thành công</p>
                  <hr className='border-none h-[1.5px] w-8 bg-gray-700' />
              </div>
          </div>
        )
      }
    </div>
)};

export default PaymentResultPage;