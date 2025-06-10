import React, { use, useContext, useEffect, useState } from 'react';
import useProductDetail from '../hooks/product/useProductDetail';
import { useParams } from 'react-router-dom';
import RelatedProduct from '../component/RelatedProduct';
import useCreateCart from '../hooks/cart/useCreateCart';
import Message from '../component/Message';
import { ShopContext } from '../context/ShopContext';

const formatPrice = (num) => {
  const integerPart = Math.floor(Number(num));
  return integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const Product = () => {
  const { productId } = useParams();
  const { product, loading, error } = useProductDetail(productId);
  const [image, setImage] = useState('');
  const [variants, setVariants] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const {totalCartItems, setTotalCartItems} = useContext(ShopContext);

  const { createCart } = useCreateCart();

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setImage(product.images[0].path);
      setVariants(product.variants);
    }
  }, [product]);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product.</div>;
  
  const uniqueSizes = [...new Set(variants.map(v => v.size))];
  const availableColors = variants
    .filter(v => v.size === selectedSize)
    .map(v => v.color)
    .filter((value, index, self) => self.indexOf(value) === index); // loại trùng

  const selectedVariant = variants.find(v => v.size === selectedSize && v.color === selectedColor);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const result = await createCart(selectedVariant.productvariantId, quantity);
    if (result) {
      const { message } = result;
      setMessage(message);
      setTotalCartItems(totalCartItems + 1);
    }else {
      setMessage('Thêm vào giỏ hàng thất bại. Vui lòng thử lại sau.');
    }
  }
  

  console.log(message)
  return product ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {product.images.map((item) => (
              <img
                onClick={() => setImage(item.path)}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                src={item.path}
                key={item.imageId}
                alt=""
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            {image ? (
              <img className='w-full h-auto' src={image} alt="" />
            ) : null}
          </div>
        </div>

        <div className='flex-1'>
          <h1 className='text-3xl font-semibold text-gray-800 mb-4'>{product.name}</h1>
          <p className='mt-5 text-3xl font-semibold text-gray-600'>{formatPrice(product.price)} vnd</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{product.description}</p>

          <div className='flex flex-col gap-4 my-8'>
            <p className='font-medium'>Chọn size</p>
            <div className='flex gap-3 flex-wrap'>
              {uniqueSizes.map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSelectedColor('');
                  }}
                  className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-semibold
                    ${selectedSize === size
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:text-blue-600'}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>

            {selectedSize && (
              <>
                <p className='font-medium mt-4'>Chọn màu</p>
                <div className='flex gap-3 flex-wrap items-center'>
                  {availableColors.map(color => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-9 h-9 rounded-full cursor-pointer border-2 transition-all duration-200
                        ${selectedColor === color ? 'border-blue-600 scale-110 shadow-md' : 'border-gray-300'}
                      `}
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></div>
                  ))}
                </div>
              </>
            )}

            {selectedSize && selectedColor && selectedVariant && (
              <p className='mt-4 text-gray-600'>
                Số lượng còn lại: <strong>{selectedVariant.quantity}</strong>
              </p>
            )}
          </div>
          {selectedSize && selectedColor && selectedVariant && (
            <div className='flex items-center gap-4 mb-6'>
              <label className='font-medium'>Số lượng:</label>
              <input
                type='number'
                min='1'
                max={selectedVariant.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className='border border-gray-300 rounded px-3 py-2 w-20 text-center'
              />
            </div>
          )}
          { selectedSize && selectedColor && selectedVariant && (
            <button onClick={(e) => (
              handleAddToCart(e)
            )}className='bg-black text-white px-8 py-3 text-sm active:bg-gray-600'>THÊM VÀO GIỎ HÀNG</button>
          )}
          
          <hr className='border-gray-500 my-10' />
          <div className='text-sm text-gray-400 mt-5 flex flex-col gap-1'>
            <p>100% sản phẩm như trong hình</p>
            <p>Có thể thanh toán khi nhận hàng</p>
            <p>Đổi trả dễ dàng khi có lỗi</p>
          </div>
        </div>
        {message && <Message message={message} />}
      </div>

      <RelatedProduct categoryId={product.categoryId} currentProduct={product.productId}/>
    </div>
  ) : <div className='opacity-0'></div>
};

export default Product;
