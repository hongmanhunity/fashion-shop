const mongoose = require("mongoose");
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn.connection.readyState === 1) {
      console.log("✅ Kết nối Database thành công!");
    } else {
      console.log("⏳ Đang kết nối Database...");
    }
  } catch (error) {
    console.log("❌ Kết nối Database thất bại!");
  }
};
module.exports = connectDatabase;
