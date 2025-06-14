import {useContext, useEffect, useState} from 'react';
import { ShopContext } from '../../context/ShopContext';

const useOrderProfiles = () => {
    const [order, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {accessToken} =  useContext(ShopContext);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/v1/order/profile?page=1&limit=20',{
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrders(data.data.categories);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải danh mục");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return { order, loading, error };
}

export default useOrderProfiles;