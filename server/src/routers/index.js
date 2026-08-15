const userRouter = require("./user");
const productRouter = require("./product");
const orderRouter = require("./order");
const { errHandler, notFound } = require("../middlewares/errHandler");

const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/order", orderRouter);
  // QUAN TRỌNG: Hai cái hứng lỗi này PHẢI nằm ở cuối cùng, sau khi đã khai báo hết các routes hợp lệ
  app.use(notFound); // Nếu chạy qua hết các route trên mà không khớp, sẽ rơi vào đây
  app.use(errHandler); // Hứng mọi lỗi được throw ra từ toàn bộ hệ thống
};

module.exports = initRouter;
