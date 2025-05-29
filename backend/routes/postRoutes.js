const express = require("express");
const router = express.Router();
const { createPost, getPosts } = require("../controllers/postController");
const { verifyToken } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

// 创建帖子（需要登录、文件上传）
router.post("/create-post", verifyToken, upload.single("image"), createPost);

// 获取所有帖子（公开）
router.get("/posts", getPosts);

module.exports = router;
