// 数据库模型
// 导入mongoose库并解构 Schema
const mongoose = require("mongoose");
const { Schema } = mongoose;

// 定义 Post 模型的结构，title、summary、content、imageUrl、author 字段
const PostSchema = new Schema(
  {
    // title字段
    title: {
      type: String,
      required: [true, "Title is required"], // 标题是必填项
      trim: true, // 自动去除标题前后的空白字符
      minlength: [1, "Title must be at least 1 characters long"], // 标题最小长度为1
    },
    summary: {
      type: String,
      required: [true, "Summary is required"], // 摘要是必填项
      trim: true, // 自动去除摘要前后的空白字符
      minlength: [1, "Summary must be at least 1 characters long"], // 摘要最小长度为1
    },
    content: {
      type: String,
      required: [true, "Content is required"], // 内容是必填项
    },
    imageUrl: {
      // 存储封面图片的URL或文件名
      type: String,
      required: [true, "Image URL is required"], // 图片URL是必填项
    },
    author: {
      type: Schema.Types.ObjectId, // 这是一个特殊的 Mongoose 类型，用于存储 MongoDB 文档的 ObjectId
      ref: "User", // 引用 'User' 模型，表示这个 ObjectId 指向 User 集合中的一个文档
      required: true, // 作者是必填项
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

// 创建 Post 模型并导出，供给其他模块使用
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
