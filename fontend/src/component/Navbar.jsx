import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useContext } from 'react';


const Navbar = () => {
    const {setShowSearch, accessToken, totalCartItems, resetContext, user} = useContext(ShopContext);

    const handleLogout = () => {
        resetContext();
    }

    console.log(user);
    return (
        <div className="flex items-center justify-between py-5 font-medium">
            <NavLink to={"/"}>
                <img src={assets.logo} alt="logo" className='w-40'/>
            </NavLink>

            <ul className="hidden lg:flex gap-5 text-lg text-gray-700 font-bold"> 
                <NavLink to="/" className="flex flex-col items-center gap-1">
                    Trang Chủ
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to="/product" className="flex flex-col items-center gap-1">
                    Sản Phẩm
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to="/contact" className="flex flex-col items-center gap-1">
                    Hotline
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to="/about" className="flex flex-col items-center gap-1">
                    Thông tin về chúng tôi
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                <NavLink to={"/product"}>
                    <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="searchIcon" className='w-5 cursor-pointer'/>
                </NavLink>

                <div className='group relative'>
                    { !accessToken && (
                        <Link to='/login'>
                            <img src={assets.profile_icon} alt="profileIcon" className='w-5 cursor-pointer'/>
                        </Link>
                    )}
                    {accessToken && (
                        <div className="relative group">
                             <img src={assets.profile_icon} alt="profileIcon" className='w-5 cursor-pointer' />
                            
                            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                    <Link to='/profile'> <p className='cursor-pointer hover:text-black'>Profile</p> </Link>
                                    <Link to='/order'><p className='cursor-pointer hover:text-black'>Orders</p></Link>
                                    <p onClick={() => {
                                        handleLogout();
                                        window.location.reload();
                                    }} className='cursor-pointer hover:text-black'>Log Out</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {accessToken && (
                   <Link to="/cart" className="relative">
                        <img src={assets.cart_icon} alt="cartIcon" className='w-5 cursor-pointer' />
                        {/*<p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                            {totalCartItems}   
                        </p>*/}
                    </Link>
                )}

            </div>
        </div>

    )
};

export default Navbar;