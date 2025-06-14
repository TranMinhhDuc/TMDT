import { useState } from 'react';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState(null);
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5001/api/v1/auth/sign-in', {
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
                    throw new Error(data.message || 'Đăng nhập thất bại');
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
                return null; // hoặc return { token: null, user: null, message: err.message }
            }
        };


    return { user, token, loading, error, login, message};
};

export default useLogin;
