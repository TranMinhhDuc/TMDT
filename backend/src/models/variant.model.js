const dbPool = require('../config/dbConnection');

const findVariant = async (productId) => {
    try {
        const query = 'SELECT * FROM productvariant WHERE productVariantId = ?';

        const [ variant ] = await dbPool.execute(query, [ productId ]);
        console.log(query);
        
        return variant;
    } catch (error) {
        console.error('Error in findVariant', error);
        throw error;
        
    }
}
const createVariant = async (productId, variants, connection) => {
    try {
        const query = `
            INSERT INTO productvariant (productId, color, size, quantity)
            VALUES ${variants.map(() => '(?, ?, ?, ?)').join(', ')}
        `;
        const params = [];
        variants.forEach(variant => {
            params.push(productId, variant.color, variant.size, variant.quantity);
        });

        const [result] = await connection.query(query, params);
        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in createVariant', error);
        throw error;
    }
};

const updateVariant = async (variant, connection) => {
    try {
        const query = `
            UPDATE productvariant
            SET color = ?, size = ?, quantity = ?
            WHERE productVariantId = ?
        `;

        const [ result ] = await connection.query(query, [variant.color, variant.size, variant.quantity, variant.productvariantId]);
        console.log(query);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in updateVariant', error);
        throw error;
    }
};

const soldProduct = async (productvariantId, quantity, connection) => {
    try {
        const query = `
            UPDATE productvariant
            SET quantity = quantity - ?
            WHERE productVariantId = ?;
        `;

        const [ result ] = await connection.execute(query, [quantity, productvariantId]);
        console.log(query);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in Sold Product', error);
        throw error
    }
}
module.exports = {
    createVariant,
    updateVariant,
    soldProduct
};