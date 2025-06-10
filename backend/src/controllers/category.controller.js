const dbPool = require("../config/dbConnection");
const { findCategories, 
    findCategoryByName, 
    createNewCategory, 
    updateOneCategory, 
    deleteOneCategory } = require("../models/category.model");

const getCategories = async (req, res, next) =>{
    try {
        const { name, gender } = req.query;

        const categories = await findCategories(name, gender);
        res.status(200).json({
            success: true,
            message: 'Find categories successfully',
            data:{
                categories
            }
        });
    } catch (error) {
        next(error);
    }  
};

const createCategory = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();
    try {
        if(req.user.role !== 'admin') {
            const error = new Error('This user can\'t access resource');
            error.statusCode = 403;
            throw error;
        }
        const { name, gender } = req.body;

        const existsCategory = await findCategoryByName(name);
        if (existsCategory.length > 0) {
            const error = new Error('Category already exists');
            error.statusCode = 400;
            throw error;
        }
        const category = await createNewCategory(name, gender, connection); 
        
        await connection.commit()
        res.status(201).json({
            success: true,
            message: 'Category create successfully',
            data: {
                category
            }
        });
    } catch (error) {
        await connection.rollback();
        next(error)
    } finally {
        if(connection) connection.release();
    }
};

const updateCategory = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        if (req.user.role !== 'admin') {
            const error = new Error('This user can\'t access the resource');
            error.statusCode = 403;
            throw error;
        }

        const categoryId = req.params.id;
        if (!categoryId) {
            const error = new Error('Category ID is missing in the request URL');
            error.statusCode = 404;
            throw error;
        }

        const { name, gender } = req.body;

        const results = await updateOneCategory(categoryId, name, gender, connection);
        if (!results) {
            const error = new Error('No category was updated. Possibly invalid ID.');
            error.statusCode = 404;
            throw error;
        }

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Update category successfully'
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

const deleteCategory = async (req, res, next) => {
    const connection = await dbPool.getConnection();
    await connection.beginTransaction();

    try {
        if (req.user.role !== 'admin') {
            const error = new Error('This user can\'t access resource');
            error.statusCode = 403;
            throw error;
        }

        const categoryId = req.params.id;
        if(!categoryId) {
            const error = new Error('Category ID is missing in the request URL')
            error.statusCode = 404;
            throw error;
        }

        const result = await deleteOneCategory(categoryId, connection);
        if (!result) {
            const error = new Error('No category was deleted. Possibly invalid ID.');
            error.statusCode = 404;
            throw error;
        }

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Delete category successfully'
        });

    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}