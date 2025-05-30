const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
// 将导入路径从 '../middleware/uploads' 改为 '../middleware/auth'
const { authenticateToken } = require("../middleware/auth");

// 创建文章
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user.userId,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "创建文章失败", error: err.message });
  }
});

// 获取所有文章
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "获取文章失败", error: err.message });
  }
});

// 根据ID获取文章详情
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!post) {
      return res.status(404).json({ message: "文章未找到" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "获取文章失败", error: err.message });
  }
});

// 更新文章（只能作者本人操作）
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "文章未找到" });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "无权限修改此文章" });
    }

    const { title, content } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "更新文章失败", error: err.message });
  }
});

// 删除文章（只能作者本人操作）
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "文章未找到" });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "无权限删除此文章" });
    }

    await post.deleteOne();
    res.json({ message: "文章已删除" });
  } catch (err) {
    res.status(500).json({ message: "删除文章失败", error: err.message });
  }
});

module.exports = router;
