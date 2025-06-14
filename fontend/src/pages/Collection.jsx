import React, { useContext, useEffect, useState } from 'react';
import useProducts from '../hooks/useProducts';
import useCategory from '../hooks/useCategory';
import ProductItem from "../component/ProductItem";
import Pagination from '../component/Pagination';
import { ShopContext } from '../context/ShopContext';

const priceOptions = [
    '50000-300000',
    '300000-500000',
    '500000-1000000',
];

const Collection = () => {
    const {search, showSearch, setSearch } = useContext(ShopContext);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceFilterOpen, setPriceFilterOpen] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [page, setPage] = useState(1);
    const { products, loading, error, totalPages, currentPage } = useProducts(
        search,
        selectedPrice,
        selectedCategory,
        page,
        5,
    );

    const { categories } = useCategory();


    if(!showSearch) {
        setSearch('');
    }  
    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
                <div className="min-w-60">
                    <p
                        className="my-2 text-xl flex items-center cursor-pointer gap-2"
                        onClick={() => setShowFilter(!showFilter)}
                    >
                        FILTER
                    </p>

                    <div className={`border border-gray-300 pl-5 my-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                        {/* Category Filter */}
                        <p className="mb-3 text-sm font-medium">Category</p>
                        <ul className="space-y-1">
                            {categories.map((cat) => (
                                <li key={cat.categoryId}>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={selectedCategory === cat.categoryId}
                                            onChange={() =>
                                                setSelectedCategory(
                                                    selectedCategory === cat.categoryId ? '' : cat.categoryId
                                                )
                                            }
                                        />
                                        {cat.name}
                                    </label>
                                </li>
                            ))}
                        </ul>

                        {/* Price Filter */}
                        <div className="mt-6">
                            <p
                                className="my-2 text-sm font-medium flex items-center gap-2 cursor-pointer"
                                onClick={() => setPriceFilterOpen(!priceFilterOpen)}
                            >
                                Price
                            </p>
                            {priceFilterOpen && (
                                <ul className="ml-2 space-y-1 text-sm">
                                    {priceOptions.map((option, index) => (
                                        <li key={index}>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="price"
                                                    className="mr-2"
                                                    checked={selectedPrice === option}
                                                    onChange={() => setSelectedPrice(
                                                        selectedPrice === option ? '' : option
                                                    )}
                                                />
                                                {option.replace('-', ' - ').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND'}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="my-10">
                    <div className="text-center py-8 text-3xl">
                        <p className="text-gray-700">Sản Phẩm</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
                        {
                            products.map((item, index) => (
                                <ProductItem key={index} id={item.productId} name={item.name}
                                            price={item.price} image={item.path} />
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Enhanced Pagination */}
            <Pagination  
                page={page}
                totalPages={totalPages}
                currentPage={currentPage}
                setPage={setPage}
            />
        </div>
    );
};

export default Collection;
