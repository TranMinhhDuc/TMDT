import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import useCategory from '../hooks/category/useCategory'
import useCreateProduct from '../hooks/product/useCreateProduct';

const AddProduct = () => {
  const { categories } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [price, setPrice] = useState('');
  const [variants, setVariants] = useState([]);
  const [variantInput, setVariantInput] = useState({
    size: '',
    color: '',
    quantity: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [productName, setProductName] = useState(null);
  const [description, setDescription] = useState(null);
  const { createProduct } = useCreateProduct();
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddVariant = () => {
    if (variantInput.size && variantInput.color && variantInput.quantity) {
      setVariants([...variants, variantInput]);
      setVariantInput({ size: '', color: '', quantity: '' });
    }
  };

  const handleRemoveVariant = (indexToRemove) => {
    const updatedVariants = variants.filter((_, index) => index !== indexToRemove);
    setVariants(updatedVariants);
  };

  const tmpImage = Object.values(imageFiles);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createProduct({
        name: productName,
        description,
        price,
        categoryId: selectedCategory,
        variants,
        imageFiles: tmpImage,
      });
      alert('Tạo sản phẩm thành công!');
      console.log(result);
    } catch (error) {
      alert('Có lỗi xảy ra: ' + error.message);
    }
  };

  return (
    <form className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Thêm sản phẩm</p>

        <div className='flex gap-2'>
          <label className='w-20' htmlFor="image1">
            <img src={imageFiles[0] ? URL.createObjectURL(imageFiles[0]) : assets.upload_area} alt="" />
            <input 
            onChange={(e) => {
              const updatedFiles = [...imageFiles];
              updatedFiles[0] = e.target.files[0];
              setImageFiles(updatedFiles);
            }}
            type="file" id='image1' hidden/>
          </label>

          <label className='w-20' htmlFor="image2">
            <img src={imageFiles[1] ? URL.createObjectURL(imageFiles[1]) : assets.upload_area} alt="" />
            <input 
            onChange={(e) => {
              const updatedFiles = [...imageFiles];
              updatedFiles[1] = e.target.files[0];
              setImageFiles(updatedFiles);
            }}
            type="file" id='image2' hidden/>
          </label>

          <label className='w-20' htmlFor="image3">
            <img src={imageFiles[2] ? URL.createObjectURL(imageFiles[2]) : assets.upload_area} alt="" />
            <input 
            onChange={(e) => {
              const updatedFiles = [...imageFiles];
              updatedFiles[2] = e.target.files[0];
              setImageFiles(updatedFiles);
            }}
            type="file" id='image3' hidden/>
          </label>

          <label className='w-20' htmlFor="image4">
            <img src={imageFiles[3] ? URL.createObjectURL(imageFiles[3]) : assets.upload_area} alt="" />
            <input 
            onChange={(e) => {
              const updatedFiles = [...imageFiles];
              updatedFiles[3] = e.target.files[0]; 
              setImageFiles(updatedFiles);
            }}
            type="file" id='image4' hidden/>
          </label>

          <label className='w-20' htmlFor="image5">
            <img src={imageFiles[4] ? URL.createObjectURL(imageFiles[4]) : assets.upload_area} alt="" />
            <input 
            onChange={(e) => {
              const updatedFiles = [...imageFiles];
              updatedFiles[4] = e.target.files[0];
              setImageFiles(updatedFiles);
            }}
            type="file" id='image5' hidden/>
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p>Tên sản phẩm</p>
        <input 
          onChange={(e) => setProductName(e.target.value)}
          className='w-full max-w-[500px] px-3 py-2 border border-gray-300' 
          type="text" placeholder='tên sản phẩm' />
      </div>

      <div className='w-full'>
        <p>Mô tả</p>
        <textarea 
          onChange={(e) => setDescription(e.target.value)}
          className='w-full max-w-[500px] px-3 py-2 border border-gray-300' 
          type="text" placeholder='Mô tả sản phẩm' />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div className='w-full max-w-[500px]'>
          <p className='mb-1'>Category</p>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className='w-full px-3 py-2 border border-gray-300'
          >
            <option value="">-- Chọn danh mục --</option>
            {categories?.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className='w-full max-w-[500px]'>
          <p className='mb-1'>Giá sản phẩm (VND)</p>
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300'
            placeholder='Nhập giá sản phẩm'
          />
        </div>
      </div>

      <div className='w-full max-w-[500px]'>
        <p className='mb-1 font-medium'>Thêm biến thể (Variant)</p>
        
        <div className='flex gap-2 mb-2'>
          {/* Size */}
          <select
            value={variantInput.size}
            onChange={(e) => setVariantInput({ ...variantInput, size: e.target.value })}
            className='border border-gray-300 px-2 py-1'
          >
            <option value="">Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          {/* Color */}
          <input
            type="text"
            placeholder="Màu sắc"
            value={variantInput.color}
            onChange={(e) => setVariantInput({ ...variantInput, color: e.target.value })}
            className='border border-gray-300 px-2 py-1 w-[100px]'
          />

          {/* Quantity */}
          <input
            type="number"
            min="0"
            placeholder="Số lượng"
            value={variantInput.quantity}
            onChange={(e) => setVariantInput({ ...variantInput, quantity: e.target.value })}
            className='border border-gray-300 px-2 py-1 w-[80px]'
          />

          {/* Add button */}
          <button
            type="button"
            onClick={handleAddVariant}
            className='bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600'
          >
            Thêm
          </button>
        </div>

        {/* Danh sách variant */}
        {variants.length > 0 && (
          <ul className='space-y-1 w-full text-sm'>
            {variants.map((v, index) => (
              <li
                key={index}
                className='flex justify-between items-center border px-3 py-1 rounded-md bg-gray-50'
              >
                <span>
                  Size: <strong>{v.size}</strong>, Màu: <strong>{v.color}</strong>, SL: <strong>{v.quantity}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className='text-red-500 hover:underline ml-2'
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center">
          <button 
          className='flex flex-col items-center justify-center bg-gray-500 text-white px-3 py-1 hover:bg-gray-600'
          onClick={(e) => handleSubmit(e)}
          >
            Thêm sản phẩm
          </button>
        </div>

      </div>
    </form>
  )
}

export default AddProduct;
