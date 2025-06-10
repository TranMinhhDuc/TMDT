const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error(err);

        if (err.code === 'ER_DUP_ENTRY') {
            const message = "Duplicate field value entered";
            error = new Error(message);
            error.statusCode = 400;
        }

        if (err.name === "CastError") {
            const message = "Resources not found";
            error = new Error(message);
            error.statusCode = 404;
        }

        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }

        if (!error.statusCode) {
            error.statusCode = 500; 
            error.message = error.message || "Internal Server Error"; // Thông báo lỗi mặc định
        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = errorMiddleware;