const dbPool = require('../config/dbConnection');

const findCategoryByName = async (name) => {
    const query = 'SELECT * FROM category WHERE name LIKE ?';
    let filter = [];
    if (name) {
        filter.push(`%${name}%`);
    } else {
        filter.push('%%');
    }

    const [category] = await dbPool.execute(query, filter);
    return category;
};

const findCategories = async (name, gender) => {
    let query = 'SELECT * FROM category WHERE 1=1';
    const filters = [];

    if (name) {
        query += ' AND name LIKE ?';
        filters.push(`%${name}%`);
    }

    if (gender) {
        query += ' AND gender = ?';
        filters.push(gender);
    }

    const [categories] = await dbPool.execute(query, filters);
    return categories;
};

const createNewCategory = async (name, gender, connection = dbPool) => {
    const query = 'INSERT INTO category (name, gender) VALUES (?, ?)';
    const [result] = await connection.execute(query, [name, gender]);
    return { categoryId: result.insertId, name, gender};
};

const updateOneCategory = async (categoryId, name, gender, connection = dbPool) => {
    let query = 'UPDATE category SET';
    const updates = [];
    const values = [];

    if (name !== undefined) {
        updates.push(' name = ?');
        values.push(name);
    }

    if (gender !== undefined) {
        updates.push(' gender = ?');
        values.push(gender);
    }

    if (updates.length === 0) {
        return null;
    }

    query += updates.join(',');
    query += ' WHERE categoryId = ?';
    values.push(categoryId);

    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
        return {
            categoryId,
            ...(name !== undefined && { name }),
            ...(gender !== undefined && { gender })
        };
    } else {
        return null;
    }
};


const deleteOneCategory = async (categoryId) => {
    const query = 'DELETE FROM category WHERE categoryId = ?';
    const [result] = await dbPool.execute(query, [categoryId]);
    return result.affectedRows > 0;
};

module.exports = {
    findCategories,
    findCategoryByName,
    createNewCategory,
    updateOneCategory,
    deleteOneCategory
};
