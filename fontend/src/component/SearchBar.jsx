import React, { useEffect } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext.jsx';
import { assets } from '../assets/assets.js';
import { useLocation } from 'react-router-dom';
const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const location = useLocation();
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        if (location.pathname == "/product") {
            setVisible(true);
        }else setVisible(false);
    }, [location]);

  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
      <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full bg-white shadow-full w-3/4 sm:w-1/2'>
        <input
          type='text'
          placeholder='Search...'
          className='flex-1 outline-none bg-inherit text-sm'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <img className="w-4" src={assets.search_icon} alt="search icon" />
      </div>
      <img onClick={(e) => setShowSearch(false)} className="inline w-3 cursor-pointer" src={assets.cross_icon} alt="" />
    </div>
  ): null;
}

export default SearchBar
