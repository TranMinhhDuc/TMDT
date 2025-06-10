import React from "react";
import useNewCollection from "../hooks/UseNewCollection.js";
import ProductItem from "./ProductItem.jsx";

const BestSeller = () => {
    const { products, loading, error } = useNewCollection(5);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="my-10">
            <div className="text-center py-8 text-3xl">
                <p className="text-gray-700">Bán chạy nhất</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {
                    products.map((item, index) => (
                        <ProductItem key={index} id={item.productId} name={item.name}
                                     price={item.price} image={item.path} />
                    ))
                }
            </div>
        </div>
    );
};

export default BestSeller;
