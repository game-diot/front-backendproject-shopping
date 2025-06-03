// 路由文件，关于用户认证相关的路由
const express = require("express");
const router = express.Router();

// 导入认证相关的控制器函数
const authController = require("../controllers/authController");
// 导入认证中间件
const authenticateToken = require("../middleware/authMiddleware");

// POST /register: 用户注册
router.post("/register", authController.register);
// POST /login: 用户登录
router.post("/login", authController.login);

// GET /profile: 获取用户资料（需要认证）
router.get("/profile", authenticateToken, authController.getProfile);
// POST /logout: 用户注销
router.post("/logout", authController.logout);

module.exports = router; // 导出路由器
