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
    // ✅ 修改这里：从 req.params 中获取 id
    const { id } = req.params;
    const { title, summary, content } = req.body; // 其他字段依然从 req.body 获取

    let newImageUrl = null;

    console.log(`[DEBUG - updatePost] Attempting to update post ID: ${id}`); // 新增调试日志
    console.log(`[DEBUG - updatePost] Request Body:`, req.body); // 打印请求体内容

    // 查找文章
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      console.log(`[DEBUG - updatePost] Post not found for ID: ${id}`); // 调试
      // ... (其他文件清理逻辑)
      return res.status(404).json({ error: "Post not found" });
    }

    // 检查当前用户是否是文章作者
    // req.user 由 authenticateToken 中间件提供
    const isAuthor =
      JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      console.log(
        `[DEBUG - updatePost] User ${req.user.username} is not author of post ID: ${id}`
      ); // 调试
      // ... (其他文件清理逻辑)
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }

    // ... (处理文件上传和更新 imageUrl 的逻辑不变)
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
    );

    console.log(`[DEBUG - updatePost] Post ID ${id} updated successfully.`); // 调试
    res.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    // ... (其他错误处理逻辑)
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

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[DEBUG - getPostById] Request for post ID: ${id}`);

    const post = await Post.findById(id).populate("author", ["username"]);
    // 🚨 关键打印：原始 post 对象，看是否有 imageUrl
    console.log(
      `[DEBUG - getPostById] Raw post from DB:`,
      post ? post.toObject() : "Post not found"
    );

    if (!post) {
      console.log(`[DEBUG - getPostById] Post not found for ID: ${id}`);
      return res.status(404).json({ error: "Post not found" });
    }

    const postObject = post.toObject();
    // 🚨 关键打印：toObject() 后的 postObject，再次确认 imageUrl
    console.log(
      `[DEBUG - getPostById] Post object after toObject():`,
      postObject
    );

    if (postObject.imageUrl) {
      console.log(
        `[DEBUG - getPostById] Original imageUrl before拼接:`,
        postObject.imageUrl
      );
      postObject.imageUrl = `http://localhost:4000/uploads/${postObject.imageUrl}`;
      console.log(
        `[DEBUG - getPostById] Final imageUrl for response:`,
        postObject.imageUrl
      );
    } else {
      // 🚨 关键打印：如果 imageUrl 缺失或为空
      console.log(
        `[DEBUG - getPostById] imageUrl is missing or empty in postObject for ID: ${id}`
      );
    }

    res.json(postObject);
  } catch (error) {
    console.error("[DEBUG - getPostById] Error fetching post by ID:", error);
    res
      .status(500)
      .json({ error: "Error fetching post", details: error.message });
  }
};
// --- 删除文章 ---
const deletePost = async (req, res) => {
  try {
    const { id } = req.params; // 从 URL 参数中获取文章 ID

    // 查找文章
    const postDoc = await Post.findById(id);

    if (!postDoc) {
      console.log(`[DEBUG - deletePost] 文章未找到，ID: ${id}`);
      return res.status(404).json({ error: "文章未找到" });
    }

    // 验证用户权限：确保当前登录用户是文章的作者
    // req.user 是由 authenticateToken 中间件设置的
    if (!req.user || !req.user.id) {
      console.log(`[DEBUG - deletePost] 用户未认证.`);
      return res.status(401).json({ error: "用户未认证，请登录" });
    }

    const isAuthor = String(postDoc.author) === String(req.user.id); // 确保比较的是字符串或 ObjectId 类型一致

    if (!isAuthor) {
      console.log(
        `[DEBUG - deletePost] 用户 ${req.user.username} (ID: ${req.user.id}) 无权删除文章 ID: ${id}`
      );
      return res.status(403).json({ error: "无权删除此文章" });
    }

    // 如果文章有封面图片，删除对应的物理文件
    if (postDoc.imageUrl) {
      const imagePath = path.join(uploadsDir, postDoc.imageUrl);
      if (fs.existsSync(imagePath)) {
        // 检查文件是否存在
        fs.unlinkSync(imagePath); // 同步删除文件
        console.log(`[DEBUG - deletePost] 已删除图片文件: ${imagePath}`);
      } else {
        console.log(`[DEBUG - deletePost] 图片文件未找到: ${imagePath}`);
      }
    }

    // 从数据库中删除文章
    await Post.findByIdAndDelete(id);

    console.log(`[DEBUG - deletePost] 文章 ID: ${id} 删除成功.`);
    res.json({ message: "文章删除成功" });
  } catch (error) {
    console.error("删除文章失败:", error);
    res.status(500).json({ error: "删除文章失败", details: error.message });
  }
};
module.exports = {
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
  deletePost,
};
