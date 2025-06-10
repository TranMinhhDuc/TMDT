import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import useLogin from '../hooks/auth/useLogin';
import useRegister from '../hooks/auth/useRegister';
import Message from '../component/Message';
import useCart from '../hooks/cart/useCart';

const Login = () => {
    const { accessToken, setAccessToken, setUser } = useContext(ShopContext);
    const [currentState, setCurrentState] = useState('Đăng nhập');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const {
        login,
        loading: loginLoading,
        error: loginError,
        user: loginUser,
        token: loginToken
    } = useLogin();

    const {
        register,
        loading: registerLoading,
        error: registerError,
        user: registerUser,
        token: registerToken
    } = useRegister();


    const handleLogin = async (e) => {
        e.preventDefault();
        if (currentState === 'Đăng nhập') {
            const result = await login(email, password);
            if (result) {
                const { token, user, message } = result;
                if (token) {
                    setAccessToken(token);
                    setUser(user);
                    setMessage(message);
                    localStorage.setItem('accessToken', token);
                } else {
                    setMessage(message);
                }
            } else {
                setMessage('Sai thông tin đăng nhập hoặc mật khẩu');
            }
        } 
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        if (currentState === 'Đăng ký tài khoản mới') {
            const result = await register(email, password);
            if (result) {
                const { token, user, message } = result;
                if (token) {
                    setAccessToken(token);
                    setUser(user);
                    setMessage(message);
                    localStorage.setItem('accessToken', token);
                } else {
                    setMessage(message);
                }
            } else {
                setMessage('đăng ký thất bại');
            }
        }
    }
    
    return (
        <>
            {!accessToken 
            ? (
                <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
                    <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                        <p className='prata-regular text-3xl'>{currentState}</p>
                        <hr className='border-none h-[1.5px] w-8 bg-gray-700' />
                    </div>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        className='w-full px-3 py-2 border border-gray-700'
                        placeholder='Email'
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className='w-full px-3 py-2 border border-gray-700'
                        placeholder='Password'
                    />
                    <div className='flex justify-between w-full text-sm mt-[-8px]'>
                        <p className='cursor-pointer hover:text-gray-900'>Quên mật khẩu?</p>
                        {currentState === 'Đăng nhập' ? (
                            <p className='cursor-pointer' onClick={() => setCurrentState('Đăng ký tài khoản mới')}>Tạo tài khoản</p>
                        ) : (
                            <p className='cursor-pointer' onClick={() => setCurrentState('Đăng nhập')}>Đăng nhập</p>
                        )}
                    </div>
                    <button  onClick={(e) => {
                        currentState === 'Đăng nhập'
                        ? handleLogin(e)
                        : handleRegister(e);
                    }} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-600'>
                        {currentState}
                    </button>
                </form>
            )
            : (
                <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
                    <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                        <p className='prata-regular text-3xl'>Chào mừng bạn trở lại!</p>
                        <hr className='border-none h-[1.5px] w-8 bg-gray-700' />
                    </div>
                    <p className='text-lg'>Bạn đã đăng nhập thành công.</p>
                </div>
            )
            
        }
        
            <div>
                <Message message={message} />    
            </div>
        </>
    );
};

export default Login;
