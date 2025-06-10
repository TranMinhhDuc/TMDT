const Router = require('express');
const {getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory} = require('../controllers/category.controller');
const authorize = require('../middlewares/auth.middleware')

const categoryRouter = Router();

categoryRouter.get('/', getCategories);
categoryRouter.post('/',authorize, createCategory);
categoryRouter.put('/:id', authorize, updateCategory);
categoryRouter.delete('/:id', authorize, deleteCategory);

module.exports = categoryRouter;