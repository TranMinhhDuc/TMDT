import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import useProducts from '../hooks/useProducts';

const RelatedProduct = ({ categoryId, currentProduct }) => {
  const { products, loading, error } = useProducts(
    ' ',
    '',
    categoryId,
    1,
    5,
  );
  
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = [];
      let count = 0;
      for (const item of products) {
        if (item.productId !== currentProduct && count < 4) {
          filtered.push(item);
          count++;
        }
      }
      setRelatedProducts(filtered);
    }
  }, [products, currentProduct]);

  if (loading) return <p>Đang tải sản phẩm liên quan...</p>;
  if (error) return <p>Lỗi khi tải sản phẩm: {error.message}</p>;

  return (
    <div className='my-24'>
      <div className='text-center py-8 text-3xl'>
        <p className="text-gray-700">CÁC SẢN PHẨM CÓ THỂ BẠN CŨNG QUAN TÂM</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
        {
          relatedProducts.map((item) => (
            <ProductItem
              key={item.productId}
              id={item.productId}
              name={item.name}
              price={item.price}
              image={item.path}
            />
          ))
        }
      </div>
    </div>
  );
};

export default RelatedProduct;
