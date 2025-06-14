const { findProduct, 
    findProducts,
    createOneProduct,
    updateOneProduct,
    deleteOneProduct } = require("../models/product.model");

const { createVariant, updateVariant } = require("../models/variant.model");
const dbPool = require("../config/dbConnection");
const { createImage, 
    addOneImage,
    deleteOneImage
 } = require("../models/image.model");
const { image } = require("../config/cloudinary");

const getProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;

        const product = await findProduct(productId);

        res.status(200).json({
            product
        })
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {

    try {
        console.log(req.query);
        const { name, categoryId, price, page, limit } = req.query;
        console.log(req.query);
        const prices = price ? price.split('-') : [];
        const products = await findProducts(name, categoryId, prices[0], prices[1], page, limit);

        res.status(200).json({
            products
        });
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        console.log(req.body);
        const categoryId = req.body.categoryId;
        const name = req.body.name;
        const description = req.body.description;
        const price = req.body.price;
        const variants = JSON.parse(req.body.variants);;
        console.log(categoryId, name, description, price, variants);
        if (req.user.role !== 'admin') {
            const error = new Error('This user can\'t access resource');
            error.statusCode = 403;
            throw error;
        }

        let existsProduct = await findProducts(name);
        existsProduct = existsProduct.products;
        if (existsProduct.length > 0) {
            const error = new Error('Product already exists');
            error.statusCode = 400;
            throw error;
        }
        const product = await createOneProduct(categoryId, req.user.userId, name, description, price, connection);
        const newVariant = await createVariant(product.productId, variants, connection);

        const images = req.files;
        if (images && images.length > 0) {
            const imagePath = images.map(img => img.path);
            const resultImage = await createImage(product.productId, imagePath, connection);
            if (!resultImage) {
                const error = new Error('Images not added');
                error.statusCode = 400;
                throw error;
            }
        }

        if (!newVariant) {
            const error = new Error('Product not created');
            error.statusCode = 400;
            throw error;
        }

        
        await connection.commit();
        connection.release();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {
                product
            }
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    }finally {
        if (connection) {
            connection.release();
        }
    }
};

const updateProduct = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const productId = req.params.id;
        const { categoryId, name, description, price } = req.body;

        if( req.user.role !== 'admin') {
            const error = new Error('This user can\'t access resource');
            error.statusCode = 403;
            throw error;
        }

        console.log(productId);
        const existsProduct = await findProduct(productId);
        if (!existsProduct) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        const updatedProduct = await updateOneProduct(
            productId, 
            categoryId, 
            name, 
            description, 
            price, 
            connection
        );

        if (updatedProduct === null || updatedProduct === false) {
            const error = new Error('Product not updated');
            error.statusCode = 400;
            throw error;
        }

        await connection.commit();
        connection.release();
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const updateProductVariant = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    
    try {
        const { productId, variants } = req.body;
        if (req.user.role !== 'admin') {
            const error = new Error('This user can\'t access resource');
            error.statusCode = 403;
            throw error;
        }

        const existsProduct = await findProduct(productId);
        if (!existsProduct) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        for (let i = 0; i < variants.length; i++) {
            const result = await updateVariant(variants[i], connection);
            if (!result) {
                const error = new Error(`Variant with ID ${variants[i].productvariantId} not updated`);
                error.statusCode = 400;
                throw error;
            }
        }

        await connection.commit();
        connection.release();

        res.status(200).json({
            success: true,
            message: 'Product variant updated successfully',
        });   
    } catch (error) {
        await connection.rollback();
        next(error);
    }finally {
        if (connection) {
            connection.release();
        }
    }
};

const deleteProduct = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const productId = req.params.id;

        if (req.user.role !== 'admin') {
            const error = new Error('This user can\'t access resource');
            error.statusCode = 403;
            throw error;
        }

        const existsProduct = await findProduct(productId);
        if (!existsProduct) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        console.log(existsProduct);
        const result = await deleteOneProduct(productId, connection);
        if (!result) {
            const error = new Error('Product not deleted');
            error.statusCode = 400;
            throw error;
        }

        await connection.commit();
        connection.release();
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const addImageForProduct = async (req, res, next) => {

    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const { productId, images } = req.body;

        if (req.user.role !== 'admin') {
            const error = new Error('This user can\'t access resource');
            error.statusCode = 403;
            throw error;
        }

        const existsProduct = await findProduct(productId);
        if (!existsProduct) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        for (let i = 0; i < images.length; i++) {
            const result = await addOneImage(productId, images[i], connection);
            if (!result) {
                const error = new Error(`Image with path ${images[i]} not added`);
                error.statusCode = 400;
                throw error;
            }
        }

        await connection.commit();
        connection.release();
        res.status(201).json({
            success: true,
            message: 'Images added successfully',
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const deleteImageForProduct = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        const imageId = req.params.id;

        if (req.user.role !== 'admin') {
            const error = new Error('This user can\'t access resource');
            error.statusCode = 403;
            throw error;
        }

        const result = await deleteOneImage(imageId, connection);
        if (!result) {
            const error = new Error('Image not deleted');
            error.statusCode = 400;
            throw error;
        }

        await connection.commit();
        connection.release();
        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    getProduct,
    getProducts,
    createProduct, 
    updateProduct,
    updateProductVariant,
    deleteProduct,
    addImageForProduct,
    deleteImageForProduct
}