const notFound = (req, res, next) => {
    const error = new Error(`Route không tồn tại - ${req.originalUrl}`);
    res.status(404);
    next(error); // Chuyển lỗi này cho errHandler hứng
};

const errHandler = (err, req, res, next) => {
    // Nếu status code vẫn là 200 (OK) mà có lỗi xảy ra thì đổi thành 500 (Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    return res.status(statusCode).json({
        success: false,
        message: err?.message || "Internal Server Error"
    });
};

module.exports = {
    notFound,
    errHandler
};
