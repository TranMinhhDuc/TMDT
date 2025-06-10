const Router = require('express');
const { getProduct, 
    getProducts, 
    createProduct, 
    updateProduct, 
    updateProductVariant,
    deleteProduct,
    addImageForProduct,
    deleteImageForProduct } = require('../controllers/product.controller');
const authorize = require('../middlewares/auth.middleware');
const upload = require('../middlewares/uploadImages.middleware');
const productRouter = Router();


productRouter.post('/image/', authorize, addImageForProduct);
productRouter.delete('/image/:id', authorize, deleteImageForProduct);

productRouter.get('/:id', getProduct);
productRouter.get('/', getProducts);
productRouter.post('/', authorize, upload.array('files'), createProduct);
productRouter.put('/variant/', authorize, updateProductVariant);
productRouter.put('/:id', authorize, updateProduct);
productRouter.delete('/:id', authorize, deleteProduct);

module.exports = productRouter;