import { useState, useEffect } from 'react';

const useProductDetail = (productId) => {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5001/api/v1/product/${productId}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data.product);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    return { product, loading, error };
};

export default useProductDetail;
