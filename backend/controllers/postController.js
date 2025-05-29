const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { title, summary, content } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ error: "标题、摘要和内容都是必需的" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "图片是必需的" });
    }

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: req.file.filename,
      author: req.user.id,
    });

    res.json(postDoc);
  } catch (err) {
    console.error("创建帖子错误:", err);
    res.status(500).json({ error: "服务器内部错误" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .exec();

    res.json(posts);
  } catch (err) {
    console.error("获取帖子错误:", err);
    res.status(500).json({ error: "服务器内部错误" });
  }
};

module.exports = { createPost, getPosts };
