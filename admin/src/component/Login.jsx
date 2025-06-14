import React, { useContext, useState } from 'react';
import useLogin from '../hooks/auth/useLogin';
import { AdminContext } from '../context/AdminContext';

const Login = () => {
    const { accessToken, setAccessToken, setUser } = useContext(AdminContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {resetContext} = useContext(AdminContext);

    const {
        login,
        loading: loginLoading,
        error: loginError,
        user: loginUser,
        token: loginToken
    } = useLogin();

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result) {
            console.log(result)
            const { token, user, message } = result;
            if(user.role !== 'admin') {
                resetContext();
                window.alert('Đăng nhập thất bại')
            } else if (token) {
                setAccessToken(token);
                setUser(user);
                setMessage(message);
                localStorage.setItem('accessToken', token);
                localStorage.setItem('shop-app-user', JSON.stringify(user));
            } else {
                setMessage(message);
            }
        } else {
            setMessage('Sai thông tin đăng nhập hoặc mật khẩu');
        }
    };

    return (
        <>
            {!accessToken 
            ? (
                <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'>
                    <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                        <p className='prata-regular text-3xl'>Đăng nhập</p>
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
                    <div className='flex justify-end w-full text-sm mt-[-8px]'>
                        <p className='cursor-pointer hover:text-gray-900'>Quên mật khẩu?</p>
                    </div>
                    <button onClick={handleLogin} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-600'>
                        Đăng nhập
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
            )}
            
        </>
    );
};

export default Login;
