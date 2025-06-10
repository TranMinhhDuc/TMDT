const dbPool = require('../config/dbConnection');

const findUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = ?;';
        console.log(query);
        const [[user]] = await dbPool.query(query, [email]);
        return user;
    } catch (error) {
        console.error('Error in findUserByEmail:', error);
        throw error;
    }
};

const findUserById = async (userId) => {
    try {
        const query = 'SELECT * FROM users WHERE userId = ?;';
        console.log(query);
        const [[user]] = await dbPool.query(query, [userId]);
        return user;
    } catch (error) {
        console.error('Error in findUserById:', error);
        throw error;
    }
};

const findUsers = async (email, page, limit) => {
    try {
        const parseOffset = parseInt((page - 1) * limit);
        const parseLimit = parseInt(limit);
        const sqlEmail = `%${email}%`;

        const query = 'SELECT * FROM users WHERE email LIKE ? LIMIT ? OFFSET ?;';
        console.log(query);
        const [users] = await dbPool.query(query, [sqlEmail, parseLimit, parseOffset]);

        const queryTotalUser = 'SELECT count(*) AS totalUser FROM users WHERE email LIKE ?;';
        console.log(queryTotalUser);
        const [[{ totalUser }]] = await dbPool.query(queryTotalUser, [sqlEmail]);

        const totalPage = Math.ceil(totalUser / limit);
        return { users, currentPage: page, totalPage, limit };
    } catch (error) {
        console.error('Error in findUsers:', error);
        throw error;
    }
};

const createUser = async (email, password, connection) => {
    try {
        const query = 'INSERT INTO users (email, password) VALUES (?, ?);';
        console.log(query);
        const [results] = await connection.query(query, [email, password]);
        return { userId: results.insertId, email };
    } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
};

const updateUser = async (userId, email, password, role, connection) => {
    try {
        const query = 'UPDATE users SET email = ?, password = ?, role = ? WHERE userId = ?;';
        console.log(query);
        const [results] = await connection.query(query, [email, password, role, userId]);
        return results.affectedRows > 0;
    } catch (error) {
        console.error('Error in updateUser:', error);
        throw error;
    }
};

const deleteUser = async (userId, connection) => {
    try {
        const query = 'DELETE FROM users WHERE userId = ?;';
        console.log(query);
        const [results] = await connection.query(query, [userId]);
        return results.affectedRows > 0;
    } catch (error) {
        console.error('Error in deleteUser:', error);
        throw error;
    }
};

module.exports = {
    findUserByEmail,
    findUserById,
    findUsers,
    createUser,
    updateUser,
    deleteUser
};
