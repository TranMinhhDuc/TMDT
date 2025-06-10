import { useState, useEffect } from 'react';

const useProducts = (name, price, categoryId, page = 1, limit = 20) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5001/api/v1/product?name=${name}&price=${price}&categoryId=${categoryId}&limit=${limit}&page=${page}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data.products.products);
                setTotalPages(data.products.totalPage);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [name, price, categoryId, limit, page]);

    return { products, loading, error, totalPages };
};

export default useProducts;
