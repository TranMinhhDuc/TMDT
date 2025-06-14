import {useEffect, useState} from 'react';

const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/v1/category/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCategories(data.data.categories);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải danh mục");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
}

export default useCategory;