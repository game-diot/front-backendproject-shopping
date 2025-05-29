const jwt = require("jsonwebtoken");

const secret = "asdfe45we45w345wegw345werjktjwertkj"; // 建议移到环境变量中

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "未授权访问" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "无效的令牌" });
  }
};

module.exports = { verifyToken, secret };
