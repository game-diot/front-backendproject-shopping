// routes/authRoutes.js
const express = require("express");
const router = express.Router(); // 创建一个新的 Express 路由器实例

// 导入认证相关的控制器函数
const authController = require("../controllers/authController"); // ✅ 导入 authController

// 导入认证中间件
const authenticateToken = require("../middleware/authMiddleware"); // ✅ 导入 authenticateToken

// --- 认证相关的路由 ---

// POST /register: 用户注册
router.post("/register", authController.register);

// POST /login: 用户登录
router.post("/login", authController.login);

// GET /profile: 获取用户资料（需要认证）
// 注意：authenticateToken 中间件在此处发挥作用，它会验证 token 并将用户信息附加到 req.user
router.get("/profile", authenticateToken, authController.getProfile);

// POST /logout: 用户注销
router.post("/logout", authController.logout);

module.exports = router; // 导出路由器
