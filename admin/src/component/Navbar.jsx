import React, { useContext } from 'react'
import {assets} from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const Navbar = () => {
  
  const {resetContext} = useContext(AdminContext);
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className='w-[max(10%,8px)]' src={assets.logo} alt="logo" />
      <button
          onClick={(e) => resetContext()}
          className="bg-gray-600 hover:bg-red-500 transition-all duration-300 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm shadow-md hover:shadow-lg"
        >
          Logout
        </button>
    </div>
  )
}

export default Navbar
