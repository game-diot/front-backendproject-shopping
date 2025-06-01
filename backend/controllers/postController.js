// controllers/postController.js
const Post = require("../models/Post"); // 导入 Post 模型
const User = require("../models/User"); // 可能需要在某些操作中获取用户数据
const fs = require("fs"); // 用于删除文件
const path = require("path"); // 用于路径操作

// 定义 uploads 目录，确保与 app.js 或 uploadMiddleware.js 中一致
const uploadsDir = path.join(__dirname, "../uploads");

// --- 创建文章 ---
const createPost = async (req, res) => {
  try {
    // req.user 包含了认证中间件附加的用户信息 (id, username)
    const { title, summary, content } = req.body;

    // 检查所有必填字段是否提供
    if (!title || !summary || !content) {
      // 如果文件已上传但其他字段缺失，需要清理已上传的文件
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(400)
        .json({ error: "All fields (title, summary, content) are required" });
    }

    // 检查是否有封面图片文件上传
    if (!req.file) {
      return res.status(400).json({ error: "Cover image is required" });
    }

    // 创建文章
    const postDoc = await Post.create({
      title,
      summary,
      content,
      imageUrl: req.file.filename, // 存储 Multer 生成的文件名
      author: req.user.id, // 从认证中间件获取作者 ID
    });

    res.status(201).json(postDoc); // 成功创建，返回 201 Created
  } catch (error) {
    console.error("Error creating post:", error);
    // 如果出错，且文件已上传，也尝试删除文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({ error: "Error creating post", details: error.message });
  }
};

// --- 更新文章 ---
const updatePost = async (req, res) => {
  try {
    // req.user 包含了认证中间件附加的用户信息 (id, username)
    const { id, title, summary, content } = req.body;
    let newImageUrl = null; // 用于存储新的图片文件名

    // 查找文章
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      // 如果找不到文章，且有新文件上传，需要清理新上传的文件
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: "Post not found" });
    }

    // 检查当前用户是否是文章作者
    const isAuthor =
      JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      // 如果不是作者，且有新文件上传，需要清理新上传的文件
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    // 如果有新文件上传，则更新 imageUrl 并删除旧文件
    if (req.file) {
      newImageUrl = req.file.filename;
      // 删除旧的封面图片
      if (
        postDoc.imageUrl &&
        fs.existsSync(path.join(uploadsDir, postDoc.imageUrl))
      ) {
        fs.unlinkSync(path.join(uploadsDir, postDoc.imageUrl));
      }
    } else {
      // 如果没有新文件上传，保留旧的 imageUrl
      newImageUrl = postDoc.imageUrl;
    }

    // 更新文章信息
    await Post.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        content,
        imageUrl: newImageUrl,
      },
      { new: true }
    ); // { new: true } 返回更新后的文档

    res.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    // 如果出错，且有新文件上传，尝试删除新上传的文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({ error: "Error updating post", details: error.message });
  }
};

// --- 获取所有文章列表 ---
const getAllPosts = async (req, res) => {
  try {
    // 查找所有文章，并填充作者信息（只包含 username 字段），按创建时间倒序排列，限制返回 20 条
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    // 为每篇文章添加完整的图片 URL
    const postsWithImageUrls = posts.map((post) => {
      const postObject = post.toObject(); // 将 Mongoose 文档转换为普通 JS 对象
      if (postObject.imageUrl) {
        // 构建完整的图片 URL，与你的 app.js 中的静态文件服务路径匹配
        postObject.imageUrl = `http://localhost:4000/uploads/${postObject.imageUrl}`;
      }
      return postObject;
    });

    res.json(postsWithImageUrls);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ error: "Error fetching posts", details: error.message });
  }
};

// --- 获取单篇文章详情 ---
const getPostById = async (req, res) => {
  try {
    const { id } = req.params; // 从 URL 参数中获取文章 ID

    // 查找指定 ID 的文章，并填充作者信息
    const post = await Post.findById(id).populate("author", ["username"]);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 为文章添加完整的图片 URL
    const postObject = post.toObject();
    if (postObject.imageUrl) {
      postObject.imageUrl = `http://localhost:4000/uploads/${postObject.imageUrl}`;
    }

    res.json(postObject);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res
      .status(500)
      .json({ error: "Error fetching post", details: error.message });
  }
};

module.exports = {
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
};
