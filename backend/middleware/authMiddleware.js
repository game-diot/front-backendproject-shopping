// 中间件文件，用于验证 JWT 令牌
const { verifyToken } = require("../utils/jwt"); // 导入我们在 utils/jwt.js 中定义的 verifyToken 函数

// 定义一个中间件函数，用于验证 JWT 令牌,接收三个参数：请求对象、响应对象和下一个中间件函数
const authenticateToken = async (req, res, next) => {
  // 从请求头中获取 token
  const { token } = req.cookies;
  // 检查是否存在 token,如果没有 token 则返回 401 状态
  if (!token) {
    return res
      .status(401)
      .json({ error: "Not authenticated: No token provided" });
  }
  // 验证 token 是否有效,并将验证结果存储在 userInfo 变量中
  try {
    const userInfo = await verifyToken(token);
    req.user = userInfo;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    // 捕捉错误,最终返回 403 状态
    return res
      .status(403)
      .json({ error: "Not authenticated: Invalid or expired token" });
  }
};

// 导出 authenticateToken 函数
module.exports = authenticateToken;
