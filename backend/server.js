require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

// 读取uploads目录，若不存在则创建
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 中间件
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// 静态文件服务
app.use("/uploads", express.static(uploadsDir));

// 路由挂载
app.use("/auth", authRoutes); // 为认证路由添加 /auth 前缀
app.use("/posts", postRoutes); // 为文章路由添加 /posts 前缀

// 根目录路由
app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

// 连接MongoDB数据库
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Create-post", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// 启动服务器
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
