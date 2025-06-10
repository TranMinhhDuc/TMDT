const dbConnection = require('../config/dbConnection');

const findWishList = async (userId, offset, limit) => {
    try {
        const query = `SELECT * FROM wishlist WHERE userId = ? LIMIT ${limit} OFFSET ${offset}`;
        const totalItemQuery = 'SELECT COUNT(*) as total FROM wishlist WHERE userId = ?';

        const [ wishList ] = await dbConnection.execute(query, [ userId ]);
        const [ totalItem ] = await dbConnection.execute(totalItemQuery, [ userId ]);

        console.log(query);
        console.log(totalItemQuery);

        const totalPage = Math.ceil(totalItem[0].total / limit);

        return { wishLists: wishList, totalPage, totalItem: totalItem[0].total };
    } catch (error) {
        console.error('Error in findWishList', error);
        throw error;
        
    }
};

const createOneWishList = async (userId, productId, connection) => {
    try {
        const query = 'INSERT INTO wishlist (userId, productId) VALUES (?, ?)';
        const [ result ] = await connection.execute(query, [ userId, productId ]);
        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in createWishList', error);
        throw error;
    }
};

const deleteOneWishList = async ( userId, wishListId, connection ) => {
    try {
        const query = 'DELETE FROM wishlist WHERE wishListId = ? AND userId = ?';
        const [ result ] = await connection.execute(query, [ wishListId, userId ]);
        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in deleteWishList', error);
        throw error;
    }
}

module.exports = {
    findWishList,
    createOneWishList,
    deleteOneWishList
};