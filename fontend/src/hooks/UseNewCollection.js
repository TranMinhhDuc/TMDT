// hooks/useNewCollection.js
import { useEffect, useState } from "react";

const useNewCollection = (limit, page = 1) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/v1/product?limit=${limit}&page=${page}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data.products.products);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [limit, page]);

    return { products, loading, error };
};

export default useNewCollection;
