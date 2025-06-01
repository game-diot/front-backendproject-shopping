// utils/jwt.js
const jwt = require("jsonwebtoken");
require("dotenv").config(); // 加载 .env 文件中的环境变量

// 从环境变量中获取密钥，如果没有则使用默认值
// !!重要!! 请将此密钥复制到你的 .env 文件中，例如：JWT_SECRET="P/h/l1uG3l/M+k8N2a+Q7t/J5c0v4w9x+y/z/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z=="
const secret =
  process.env.JWT_SECRET ||
  "P/h/l1uG3l/M+k8N2a+Q7t/J5c0v4w9x+y/z/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z==";

/**
 * 生成 JWT token
 * @param {object} payload - 包含在 token 中的数据，如 { username, id }
 * @param {string} expiresIn - token 的过期时间，如 '1h', '7d'
 * @returns {Promise<string>} - 返回一个 Promise，解析为生成的 token 字符串
 */
const generateToken = (payload, expiresIn = "1h") => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) {
        console.error("Error signing JWT:", err);
        return reject(err);
      }
      resolve(token);
    });
  });
};

/**
 * 验证 JWT token
 * @param {string} token - 需要验证的 token 字符串
 * @returns {Promise<object>} - 返回一个 Promise，解析为解码后的 token 信息
 */
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) {
        console.error("Error verifying JWT:", err);
        return reject(err);
      }
      resolve(info);
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
  secret, // 导出 secret，如果其他地方需要直接访问 (例如用于验证cookie)
};
