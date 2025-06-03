// 控制器文件，用于处理用户注册、登录、获取用户资料和注销等请求
const User = require("../models/User"); // 导入 User 模型 (对应 MongoDB 的 users 集合)
const bcrypt = require("bcryptjs"); // 导入 bcryptjs 库，用于密码哈希和比较
const { generateToken } = require("../utils/jwt"); // 导入我们自定义的 JWT 辅助函数，用于生成 Token

//定义注册处理函数逻辑
const register = async (req, res) => {
  // 从请求体中获取用户名、邮箱和密码
  const { username, email, password } = req.body;
  // 逻辑判断，如果用户名、邮箱或密码为空，返回错误
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required" });
  }
  // 逻辑判断，如果用户名或邮箱已存在，返回错误
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    // 使用 bcrypt 对密码进行哈希，复杂度为 10
    const hashedPassword = await bcrypt.hash(password, 10);
    // 创建新用户文档并保存到数据库
    const userDoc = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });

    // 响应成功，返回用户 ID 和用户名
    res.status(201).json({ id: userDoc._id, username: userDoc.username }); // 201 Created
  } catch (err) {
    console.error("Registration error:", err);
    // 处理验证错误，返回 400 Bad Request
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    // 其他未知错误，返回 500 Internal Server Error
    res.status(500).json({ error: "Internal server error" });
  }
};

//定义登录处理函数逻辑
const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier 可以是用户名或邮箱
  // 逻辑判断，如果用户名、邮箱或密码为空，返回错误
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "Username/Email and password are required" });
  }

  // 使用 $or 操作符来查询用户名或邮箱是否存在
  try {
    const userDoc = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    // 如果用户不存在或密码不匹配，返回错误
    if (!userDoc) {
      return res
        .status(400)
        .json({ error: "Invalid username/email or password" });
    }

    // 使用 bcrypt 比较密码
    const passOk = await bcrypt.compare(password, userDoc.passwordHash);
    // 如果密码不匹配，返回错误
    if (!passOk) {
      return res
        .status(400)
        .json({ error: "Invalid username/email or password" });
    }

    // 生成 JWT Token，有效期为 1 小时
    const token = await generateToken(
      { username: userDoc.username, id: userDoc._id },
      "1h"
    );
    // 响应成功，cookie 中设置 token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000,
    });

    // 响应成功，返回用户 ID 和用户名
    res.status(200).json({
      id: userDoc._id,
      username: userDoc.username,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//定义获取用户资料处理函数逻辑
const getProfile = async (req, res) => {
  // 从请求对象中获取用户 ID
  const { id } = req.user;
  // 从数据库中查找用户
  try {
    const user = await User.findById(id).select("-passwordHash");
    // 如果用户不存在，返回错误
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // 响应成功，返回用户 ID、用户名和邮箱
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 定义注销登录处理函数逻辑
const logout = (req, res) => {
  // 清空 cookie
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0), // 设置过期时间为过去的时间
    })
    .json({ message: "Logout successful" });
};

// 导出注册、登录、获取用户资料和注销等处理函数
module.exports = {
  register,
  login,
  getProfile,
  logout,
};
