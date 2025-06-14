import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

const useCreateProduct = () => {
    const {accessToken} = useContext(AdminContext);
    const createProduct = async ({ name, description, price, categoryId, variants, imageFiles }) => {
    console.log(categoryId)
    try {

        console.log(imageFiles)
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('categoryId', categoryId);
        formData.append('variants', JSON.stringify(variants)); 

        imageFiles.forEach((file) => {
            formData.append('files', file);
        });

      const response = await fetch('http://localhost:5001/api/v1/product/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Tạo sản phẩm thất bại');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
      throw error;
    }
  };

  return { createProduct };
};

export default useCreateProduct;
