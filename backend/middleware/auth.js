const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // 如果没有token，返回401 Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // token无效，返回403 Forbidden
    }
    req.user = user; // 将解码后的用户信息添加到请求对象中
    next(); // 继续处理下一个中间件或路由处理函数
  });
};

module.exports = { authenticateToken };
