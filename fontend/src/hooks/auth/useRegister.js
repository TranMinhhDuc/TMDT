import React, { useState } from 'react';

const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState(null);
    const register = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5001/api/v1/auth/sign-up', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                setUser(data.data.user);
                setToken(data.data.token);
                setMessage(data.message);

                if (!response.ok) {
                    throw new Error(data.message || 'Đăng ký thất bại');
                }

                setLoading(false);

                return {
                    token: data.data.token,
                    user: data.data.user,
                    message: data.message
                };

            } catch (err) {
                setError(err.message);
                setLoading(false);
                return null;
            }
        };


    return { user, token, loading, error, register, message};

};

export default useRegister;
