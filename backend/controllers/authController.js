// controllers/authController.js
const User = require("../models/User"); // 导入 User 模型 (对应 MongoDB 的 users 集合)
const bcrypt = require("bcryptjs"); // 导入 bcryptjs 库，用于密码哈希和比较
const { generateToken } = require("../utils/jwt"); // 导入我们自定义的 JWT 辅助函数，用于生成 Token

// --- 用户注册处理函数 ---
const register = async (req, res) => {
  const { username, email, password } = req.body; // 从请求体中获取用户名、邮箱和密码

  // 1. 基本输入验证：检查所有必填字段是否已提供
  if (!username || !email || !password) {
    return res
      .status(400) // Bad Request
      .json({ error: "Username, email, and password are required" });
  }

  try {
    // 2. 检查用户或邮箱是否已存在，防止重复注册
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400) // Bad Request
        .json({ error: "Username or email already exists" });
    }

    // 3. 对用户密码进行哈希处理，增加安全性
    // bcrypt.hash(password, saltRounds) 异步执行，返回 Promise
    const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10，表示哈希强度

    // 4. 创建新用户文档并保存到数据库
    const userDoc = await User.create({
      username,
      email,
      passwordHash: hashedPassword, // 使用模型中定义的 passwordHash 字段存储哈希密码
    });

    // 5. 注册成功，返回用户ID和用户名 (不返回敏感的密码信息)
    res.status(201).json({ id: userDoc._id, username: userDoc.username }); // 201 Created
  } catch (err) {
    console.error("Registration error:", err);
    // 如果是 Mongoose 验证错误 (例如：不符合 minlength, match 等 schema 规则)
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message }); // 返回 Mongoose 的错误信息
    }
    // 其他服务器内部错误
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- 用户登录处理函数 ---
const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier 可以是用户名或邮箱

  // 1. 基本输入验证：检查用户名/邮箱和密码是否为空
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ error: "Username/Email and password are required" });
  }

  try {
    // 2. 查找用户：通过用户名或邮箱在数据库中查找用户
    const userDoc = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    // 3. 如果用户不存在
    if (!userDoc) {
      return res
        .status(400)
        .json({ error: "Invalid username/email or password" });
    }

    // 4. 比较传入的密码与数据库中存储的哈希密码
    // bcrypt.compare(plainTextPassword, hashedPassword) 异步执行，返回 Promise
    const passOk = await bcrypt.compare(password, userDoc.passwordHash);
    if (!passOk) {
      return res
        .status(400)
        .json({ error: "Invalid username/email or password" });
    }

    // 5. 密码匹配，生成 JWT token
    // generateToken 函数会签发一个包含用户 ID 和用户名的 JWT
    const token = await generateToken(
      { username: userDoc.username, id: userDoc._id },
      "1h"
    ); // Token 有效期 1 小时

    // 6. 将 JWT token 设置为 HttpOnly Cookie 发送给客户端
    res.cookie("token", token, {
      httpOnly: true, // 阻止客户端 JavaScript 访问 Cookie，提高安全性
      secure: process.env.NODE_ENV === "production", // 仅在生产环境 (HTTPS) 中发送此 Cookie
      sameSite: "lax", // 限制 Cookie 的发送范围，防止 CSRF 攻击 (lax, strict, none)
      maxAge: 3600000, // Cookie 有效期 1 小时 (毫秒)
    });

    // 7. 登录成功，返回用户ID和用户名
    res.status(200).json({
      id: userDoc._id,
      username: userDoc.username,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- 获取用户资料处理函数 ---
// 此函数依赖于 authMiddleware.js，它会在请求到达此处之前验证 token 并将用户信息附加到 req.user
const getProfile = async (req, res) => {
  // 从 req.user 中获取认证中间件提供的用户信息 (包含 id 和 username)
  // req.user 已经被 populate，这里可以直接使用其 id
  const { id } = req.user;

  try {
    // 根据用户 ID 查询用户信息，但排除敏感的 passwordHash 字段
    const user = await User.findById(id).select("-passwordHash");

    // 如果用户不存在 (理论上不应该发生，因为 token 已经验证通过)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 返回用户的公开资料信息
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Internal server error" }); // 数据库查询失败或其他服务器错误
  }
};

// --- 用户注销处理函数 ---
const logout = (req, res) => {
  // 通过设置一个空值和过期时间为过去，来清除客户端的 token Cookie
  // 实际上，这只是告诉浏览器删除这个 Cookie，服务器端没有存储 session
  res
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0), // 将 Cookie 的过期日期设置为过去，浏览器会立即删除它
    })
    .json({ message: "Logout successful" }); // 返回成功消息
};

// 导出所有控制器函数，以便在路由文件中引用
module.exports = {
  register,
  login,
  getProfile,
  logout,
};
