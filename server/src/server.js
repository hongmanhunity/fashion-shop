const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/dbConnect");
const initRouter = require("./routers");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

connectDatabase();
initRouter(app);
//Config server
app.get("/", (req, res) => {
  res.send("🚀 Server E-commerce is running...");
});

app.listen(port, () => {
  console.log(`✅ Server đang chạy mượt mà tại http://localhost:${port}`);
});
