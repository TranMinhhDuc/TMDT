const dbPool = require('../config/dbConnection');

const createImage = async (productId, images, connection) => {
    try {
        const query = `
            INSERT INTO images (productId, path)
            VALUES ${images.map(() => '(?, ?)').join(', ')};
        `;  
        console.log(query);
        const params = images.flatMap(image => [productId, image]);

        console.log(params);
        const [ result ] = await connection.query(query, params);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in createdImage', error);
        throw error;
    }
};

const addOneImage = async (productId, imagePath, connection) => {
    try {
        const query = `
            INSERT INTO images (productId, path)
            VALUES (?, ?);
        `;

        const [ result ] = await connection.query(query, [productId, imagePath]);
        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in addImageForProduct', error);
        throw error;
    }
}

const deleteOneImage = async (imageId, connection) => {
    try {
        const query = `
            DELETE FROM images
            WHERE imageId = ?;
        `;

        const [ result ] = await connection.query(query, [imageId]);
        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in deleteImageForProduct', error);
        throw error;
    }
}

module.exports = {
    createImage,
    addOneImage,
    deleteOneImage
};