//全局文件
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

//导入自定义模块
const connectDB = require("./config/db");
const authRouter = require("./routes/authRouter"); // 认证相关路由
const postRouter = require("./routes/postRouter"); // 文章相关路由

const app = express();

//全局中间件配置
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

// 连接数据库
connectDB();

// 路由挂载
app.use("/", authRouter);
app.use("/", postRouter);

//服务器相关内容
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log(`Frontend should be running on http://localhost:5173`);
});
