const dbConnection = require("../config/dbConnection");

const getReviewsByProductId = async (productId, offset, limit) => {
    try {
        const query = `SELECT * FROM review WHERE productId = ? LIMIT ${limit} OFFSET ${offset}`;
        const totalItemQuery = 'SELECT COUNT(*) as total FROM review WHERE productId = ?';
        
        const [reviews] = await dbConnection.execute(query, [productId]);
        const [totalItem] = await dbConnection.execute(totalItemQuery, [productId]);

        console.log(query);
        console.log(totalItemQuery);

        const totalPage = Math.ceil(totalItem[0].total / limit);

        return { reviews, totalPage, totalItem: totalItem[0].total };
    } catch (error) {
        console.error("Error in getReviewsByProductId:", error);
        throw error;        
    }
};

const createOneReview = async (userId, productId, comment, connection) => {
    try {
        const query = `INSERT INTO review (userId, productId, comment) VALUES (?, ?, ?)`;
        const [result] = await connection.execute(query, [userId, productId, comment]);
        console.log(query);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error creating review:", error);
        throw error;        
    }
};

const deleteOneReview = async (userId, reviewId, connection) => {
    try {
        const query = `DELETE FROM review WHERE reviewId = ? AND userId = ?`;
        const [result] = await connection.execute(query, [reviewId, userId]);
        console.log(query);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;        
    }
};

module.exports = {
    getReviewsByProductId,
    createOneReview,
    deleteOneReview
};