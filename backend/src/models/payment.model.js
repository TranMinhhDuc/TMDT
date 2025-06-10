const createOnePayment = async (orderId, paymentMethod, paymentCode, totalPrice, connection) => {
    try {
        const query = `
            INSERT INTO payment (orderId, paymentMethod, paymentCode, paymentStatus, amount) 
            VALUES (?, ?, ?, 'not paid', ?)`;
        const [result] = await connection.execute(query, [orderId, paymentMethod, paymentCode, totalPrice]);

        console.log(query);

        return result.affectRows > 0;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
}

const updateOnePayment = async (paymentStatus, paymentCode, connection) => {
    try {
        const query = `UPDATE payment SET paymentStatus = ? WHERE paymentCode = ?`;
        const [result] = await connection.execute(query, [paymentStatus, paymentCode]);

        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating payment:', error);
        throw error;
    }
}

const updatePaymentById = async (paymentStatus, paymentId, connection) => {
    try {
        const query = `UPDATE payment SET paymentStatus = ? WHERE paymentId = ?`;
        const [result] = await connection.execute(query, [paymentStatus, paymentId]);

        console.log(query);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating payment by ID:', error);
        throw error;
    }
}
module.exports = {
    createOnePayment,
    updateOnePayment,
    updatePaymentById
}