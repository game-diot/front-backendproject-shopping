// 路由文件，用于定义与文章相关的路由
const express = require("express");
const router = express.Router();

// 导入文章相关的控制器函数
const postController = require("../controllers/postController");
// 导入认证中间件 (用于保护需要登录才能操作的路由
const authenticateToken = require("../middleware/authMiddleware");
// 导入文件上传中间件 (用于处理文章封面图片上传)
const uploadMiddleware = require("../middleware/uploadMiddleware");

// POST /post: 创建新文章 (需要认证和文件上传)
router.post(
  "/post",
  uploadMiddleware.single("file"),
  authenticateToken,
  postController.createPost
);

// PUT /post: 更新文章 (需要认证和文件上传)
router.put(
  "/post/:id",
  uploadMiddleware.single("file"),
  authenticateToken,
  postController.updatePost
);
// GET /post: 获取所有文章列表 (不需要认证)
router.get("/post", postController.getAllPosts);
// GET /post/:id: 获取单篇文章详情 (不需要认证)
router.get("/post/:id", postController.getPostById);
// DELETE /post/:id: 删除文章 (需要认证)
router.delete("/post/:id", authenticateToken, postController.deletePost);
module.exports = router; // 导出路由器
