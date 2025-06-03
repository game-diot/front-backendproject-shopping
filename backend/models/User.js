// 数据库模型
const mongoose = require("mongoose");
// 定义用户模式，包含用户名、邮箱和密码哈希值
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"], // 用户名是必填项
      unique: true, // 用户名必须唯一
      minlength: [3, "Username must be at least 3 characters long"], // 用户名最小长度为3
      trim: true, // 自动去除用户名前后的空白字符
    },
    email: {
      type: String,
      required: [true, "Email is required"], // 邮箱是必填项
      unique: true, // 邮箱必须唯一
      match: [/.+@.+\..+/, "Please enter a valid email address"], // 邮箱格式验证
      lowercase: true, // 邮箱存储前转换为小写
      trim: true, // 自动去除邮箱前后的空白字符
    },
    passwordHash: {
      // 存储加密后的密码哈希值
      type: String,
      required: [true, "Password is required"], // 密码哈希值是必填项
      minlength: [6, "Password must be at least 6 characters long"], // 定义密码的最小长度（这里指的是原始密码的长度要求，尽管存储的是哈希值）
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

// 创建 User 模型并导出供给其他模块使用
const User = mongoose.model("User", UserSchema);
module.exports = User;
