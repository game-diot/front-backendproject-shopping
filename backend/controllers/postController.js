//控制器文件，用于处理与文章相关的请求
const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const uploadsDir = path.join(__dirname, "../uploads");

//定义创建文章的处理函数
const createPost = async (req, res) => {
  try {
    // 从请求体中获取文章的标题、摘要和内容
    const { title, summary, content } = req.body;

    // 逻辑判断，如果标题、摘要或内容为空，返回错误
    if (!title || !summary || !content) {
      // 如果有文件上传失败，删除已上传的文件
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      // 返回错误信息
      return res
        .status(400)
        .json({ error: "All fields (title, summary, content) are required" });
    }

    // 逻辑判断，如果没有上传文件，返回错误
    if (!req.file) {
      return res.status(400).json({ error: "Cover image is required" });
    }
    // 创建新的文章文档模板，标题、摘要、内容、图片URL和作者
    const postDoc = await Post.create({
      title,
      summary,
      content,
      imageUrl: req.file.filename,
      author: req.user.id,
    });
    // 响应成功
    res.status(201).json(postDoc);
  } catch (error) {
    console.error("Error creating post:", error);
    // 如果有文件上传失败，删除已上传的文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res
      .status(500)
      .json({ error: "Error creating post", details: error.message });
  }
};

//定义更新文章的处理函数
const updatePost = async (req, res) => {
  try {
    // 从请求体中获取文章的标题、摘要和内容
    const { id } = req.params;
    const { title, summary, content } = req.body;
    let newImageUrl = null;
    // 打印调试信息
    console.log(`[DEBUG - updatePost] Attempting to update post ID: ${id}`);
    console.log(`[DEBUG - updatePost] Request Body:`, req.body);

    //从数据库中获取的文章文档，进行逻辑判断，如果文章不存在或用户不是作者，返回错误
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      console.log(`[DEBUG - updatePost] Post not found for ID: ${id}`);
      return res.status(404).json({ error: "Post not found" });
    }
    // 逻辑判断，如果用户不是作者，返回错误
    const isAuthor =
      JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
    if (!isAuthor) {
      console.log(
        `[DEBUG - updatePost] User ${req.user.username} is not author of post ID: ${id}`
      );
      return res
        .status(403)
        .json({ error: "You are not authorized to update this post" });
    }
    // 逻辑判断，如果有新的文件上传，更新文章的图片URL
    if (req.file) {
      newImageUrl = req.file.filename;
      // 删除旧的图片文件
      if (
        postDoc.imageUrl &&
        fs.existsSync(path.join(uploadsDir, postDoc.imageUrl))
      ) {
        fs.unlinkSync(path.join(uploadsDir, postDoc.imageUrl));
      }
    } else {
      // 如果没有新的文件上传，保持旧的图片URL
      newImageUrl = postDoc.imageUrl;
    }
    // 更新文章文档结构
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
    // 响应成功
    console.log(`[DEBUG - updatePost] Post ID ${id} updated successfully.`); // 调试
    res.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res
      .status(500)
      .json({ error: "Error updating post", details: error.message });
  }
};
// 定义获取所有文章的处理函数
const getAllPosts = async (req, res) => {
  try {
    // 从数据库中获取所有文章，并按照创建时间降序排列，限制返回数量为20
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    // 将图片URL拼接成完整的URL
    const postsWithImageUrls = posts.map((post) => {
      const postObject = post.toObject();
      if (postObject.imageUrl) {
        postObject.imageUrl = `http://localhost:4000/uploads/${postObject.imageUrl}`;
      }
      return postObject;
    });
    // 响应文章列表URL
    res.json(postsWithImageUrls);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ error: "Error fetching posts", details: error.message });
  }
};

// 定义获取单个文章的处理函数
const getPostById = async (req, res) => {
  try {
    // 从请求参数中获取文章ID
    const { id } = req.params;
    console.log(`[DEBUG - getPostById] Request for post ID: ${id}`);
    // 从数据库中获取文章，并按照创建时间降序排列
    const post = await Post.findById(id).populate("author", ["username"]);

    console.log(
      `[DEBUG - getPostById] Raw post from DB:`,
      post ? post.toObject() : "Post not found"
    );
    // 如果文章不存在，返回错误
    if (!post) {
      console.log(`[DEBUG - getPostById] Post not found for ID: ${id}`);
      return res.status(404).json({ error: "Post not found" });
    }
    // 将图片URL拼接成完整的URL
    const postObject = post.toObject();

    console.log(
      `[DEBUG - getPostById] Post object after toObject():`,
      postObject
    );
    // 如果文章存在，将图片URL拼接成完整的URL
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
// 定义删除文章的处理函数
const deletePost = async (req, res) => {
  try {
    // 从请求参数中获取文章ID
    const { id } = req.params;
    // 从数据库中获取文章
    const postDoc = await Post.findById(id);
    // 逻辑判断，如果文章不存在，返回错误
    if (!postDoc) {
      console.log(`[DEBUG - deletePost] 文章未找到，ID: ${id}`);
      return res.status(404).json({ error: "文章未找到" });
    }
    // 逻辑判断，如果用户未认证或用户不是文章的作者，返回错误
    if (!req.user || !req.user.id) {
      console.log(`[DEBUG - deletePost] 用户未认证.`);
      return res.status(401).json({ error: "用户未认证，请登录" });
    }
    // 逻辑判断，如果用户不是文章的作者，返回错误
    const isAuthor = String(postDoc.author) === String(req.user.id);
    if (!isAuthor) {
      console.log(
        `[DEBUG - deletePost] 用户 ${req.user.username} (ID: ${req.user.id}) 无权删除文章 ID: ${id}`
      );
      return res.status(403).json({ error: "无权删除此文章" });
    }
    // 删除文章图片文件
    if (postDoc.imageUrl) {
      const imagePath = path.join(uploadsDir, postDoc.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
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

// 导出创建,更新,删除,获取文章的处理函数
module.exports = {
  createPost,
  updatePost,
  getAllPosts,
  getPostById,
  deletePost,
};
