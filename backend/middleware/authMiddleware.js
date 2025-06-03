// backend/middleware/authMiddleware.js
const { verifyToken } = require("../utils/jwt"); // 导入我们在 utils/jwt.js 中定义的 verifyToken 函数

/**
 * JWT 认证中间件
 * 验证请求 Cookie 中的 token，并将解码后的用户信息附加到 req.user
 *
 * @param {object} req - Express 请求对象
 * @param {object} res - Express 响应对象
 * @param {function} next - Express next() 回调函数
 */
const authenticateToken = async (req, res, next) => {
  // ✅ 关键修改：从请求的 Cookie 中获取 token
  // req.cookies 对象由 cookie-parser 中间件填充
  const { token } = req.cookies;

  // 1. 检查是否存在 token
  if (!token) {
    // 如果没有 token，表示未认证，返回 401 状态码
    return res
      .status(401)
      .json({ error: "Not authenticated: No token provided" });
  }

  try {
    // 2. 尝试验证 token
    // verifyToken 函数会处理 jwt.verify 的异步回调，并返回 Promise
    const userInfo = await verifyToken(token);

    // 3. 如果验证成功，将解码后的用户信息附加到请求对象上
    // 这样后续的路由处理函数可以通过 req.user 访问用户数据
    req.user = userInfo;

    // 4. 调用 next() 将控制权传递给下一个中间件或路由处理函数
    next();
  } catch (err) {
    // 5. 如果 token 验证失败（如 token 无效、签名不匹配、过期）
    console.error("Authentication error:", err.message);
    // 返回 403 Forbidden 状态码，表示提供了认证但无效或无权限
    return res
      .status(403)
      .json({ error: "Not authenticated: Invalid or expired token" });
  }
};

module.exports = authenticateToken; // 直接导出中间件函数
