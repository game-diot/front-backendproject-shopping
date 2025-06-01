// app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

// --- 导入自定义模块 ---
const connectDB = require("./config/db");
const authRouter = require("./routes/authRouter"); // 认证相关路由
const postRouter = require("./routes/postRouter"); // 文章相关路由

// --- 初始化 Express 应用 ---
const app = express();

// --- 全局中间件配置 ---
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // 确保这里是你的前端地址
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // 解析 JSON 格式的请求体
app.use(cookieParser()); // 解析 Cookie

// 静态文件服务：将 'uploads' 目录设置为静态文件目录
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// --- 数据库连接 ---
connectDB();

// --- 路由挂载 ---
// ✅ 修改这里：将认证相关的路由直接挂载到根路径 '/'
// 这使得前端请求 http://localhost:4000/register, http://localhost:4000/login 可以直接被匹配
app.use("/", authRouter);

// ✅ 修改这里：将文章相关的路由也直接挂载到根路径 '/'
// 因为 postRoutes.js 内部已经定义了 /post, /post/:id 等，它们不会与认证路由冲突
app.use("/", postRouter);

// --- 启动服务器 ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Frontend should be running on http://localhost:5173`);
});
