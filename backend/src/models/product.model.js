const dbPool = require('../config/dbConnection');

const findProduct = async (productId) => {
  try {
    const query = `
      SELECT 
        p.productId, p.name, p.description, p.categoryId, p.createDate, p.price,
        i.imageId, i.path,
        v.productvariantId, v.color, v.size, v.quantity
      FROM product p
      LEFT JOIN images i ON p.productId = i.productId
      LEFT JOIN productvariant v ON p.productId = v.productId
      WHERE p.productId = ?`;

    console.log(query);
    const [rows] = await dbPool.execute(query, [ productId ]);

    if (rows.length === 0) {
      return null;
    }

    const product = {
      productId: rows[0].productId,
      name: rows[0].name,
      price: rows[0].price,
      description: rows[0].description,
      categoryId: rows[0].categoryId,
      createdAt: rows[0].createdAt,
      updatedAt: rows[0].updatedAt,
      images: [],
      variants: []
    };

    const imageSet = new Set();
    const variantSet = new Set();

    rows.forEach(row => {
      if (row.imageId && !imageSet.has(row.imageId)) {
        product.images.push({
          imageId: row.imageId,
          path: row.path
        });
        imageSet.add(row.imageId);
      }

      if (row.productvariantId && !variantSet.has(row.productvariantId)) {
        product.variants.push({
          productvariantId: row.productvariantId,
          color: row.color,
          size: row.size,
          quantity: row.quantity
        });
        variantSet.add(row.productvariantId);
      }
    });

    return product;
  } catch (error) {
    console.error('Error in find product', error);
    throw error;
  }
};

const findProducts = async (name, categoryId, minPrice, maxPrice, page = 1, limit = 10) => {
  try {
    let query = `
      SELECT 
        p.productId, p.name, p.description, p.categoryId, p.createDate, p.price,
        i.path
      FROM product p
      LEFT JOIN images i ON i.imageId = (
        SELECT imageId 
        FROM images 
        WHERE productId = p.productId 
        ORDER BY imageId ASC 
        LIMIT 1
      )
      WHERE 1=1
    `;
    
    let totalProductQuery = 'SELECT COUNT(*) AS totalProduct FROM product WHERE 1=1';
    const params = [];

    if (name) {
      query += ' AND p.name LIKE ?';
      totalProductQuery += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    if (categoryId) {
      query += ' AND p.categoryId = ?';
      totalProductQuery += ' AND categoryId = ?';
      params.push(categoryId);
    }
    if (minPrice !== undefined) {
      query += ' AND p.price >= ?';
      totalProductQuery += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice !== undefined) {
      query += ' AND p.price <= ?';
      totalProductQuery += ' AND price <= ?';
      params.push(maxPrice);
    }

    const parsedLimit = parseInt(limit);
    const parsedOffset = (parseInt(page) - 1) * parsedLimit;


    query += ' ORDER BY p.createDate DESC ';
    query += ` LIMIT ${parsedLimit} OFFSET ${parsedOffset} ;`;
    const [products] = await dbPool.execute(query, params);
    console.log(query)
    const [[{ totalProduct }]] = await dbPool.execute(totalProductQuery, params);
    const totalPage = Math.ceil(totalProduct / limit);
    return {products, currentPage: page, totalPage, limit, totalItems: totalProduct};
  } catch (error) {
    console.error('Error in findProducts', error);
    throw error;
  }
};

const createOneProduct = async (categoryId, userId, name, description, price, connection) => {
  try {
    const query = 'INSERT INTO product (categoryId, userId, name, description, price) VALUES (?, ?, ?, ?, ?)';
    const [result] = await connection.execute(query, [categoryId, userId, name, description, price]);
    console.log(query);
    return {
      productId: result.insertId,
      categoryId,
      name
    };
  } catch (error) {
    console.error('Error in createOneProduct', error);
    throw error;
  }
};

const updateOneProduct = async (productId, categoryId, name, description, price) => {
  try {
    const fields = [];
    const values = [];

    if(categoryId) {
      fields.push('categoryId = ?');
      values.push(categoryId);
    };
    if(name) {
      fields.push('name = ?');
      values.push(name);
    };
    if(description) {
      fields.push('description = ?');
      values.push(description);
    };
    if(price) {
      fields.push('price = ?');
      values.push(price);
    };
    if(price === 0) {
      const error = new Error('Price must be greater than 0');
      error.statusCode = 400;
      throw error;
    }

    if (fields.length === 0) {
      return null;
    };

    const query = `UPDATE product SET ${fields.join(', ')} WHERE productId = ?`;
    values.push(productId);

    const [result] = await dbPool.execute(query, values);
    if (result.affectedRows === 0) {
      return null;
    };

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in updateOneProduct', error);
    throw error;
  }
};

const deleteOneProduct = async (productId, connection) => {
  try {
    const query = `DELETE FROM product WHERE productId = ?`;
    const [result] = await connection.execute(query, [productId]);
    console.log(query);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error in deleteOneProduct', error);
    throw error;
  }
};

module.exports = {
  findProduct,
  findProducts,
  createOneProduct,
  updateOneProduct,
  deleteOneProduct
};