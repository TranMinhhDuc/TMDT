import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='w-full grid sm:grid-cols-3 gap-14 my-10 mt-40 text-sm'>
        <div>
            <img className='mb-5 w-32' src={assets.logo} alt="logo" />
            <p className='w-full md:w-10/14 text-gray-600'>
                Chúng tôi mang đến thời trang chất lượng với giá cả hợp lý, 
                phù hợp cho mọi phong cách. 
                Cập nhật xu hướng mới mỗi ngày – Thời trang cho bạn, từ chúng tôi.
            </p>    
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>Công ty</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Giới thiệu</li>
            <li>Cửa hàng</li>
            <li>Liên hệ</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer
