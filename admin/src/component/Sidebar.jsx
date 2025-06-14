import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const navItems = [
  { to: '/add', icon: assets.add_icon, label: 'Thêm sản phẩm' },
  { to: '/order', icon: assets.order_icon, label: 'Quản lý đơn hàng' },
  { to: '/product', icon: assets.product_icon || assets.order_icon, label: 'Quản lý sản phẩm' },
  { to: '/user', icon: assets.user_icon || assets.add_icon, label: 'Quản lý người dùng' },
];

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen bg-white shadow-md'>
      <div className='flex flex-col gap-2 pt-6 px-3 text-[15px]'>
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <img className='w-5 h-5' src={item.icon} alt={item.label} />
            <span className='hidden md:block'>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
