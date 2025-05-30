const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// 注册
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "用户名已存在" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "注册成功" });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

// 登录
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "用户名或密码错误" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "用户名或密码错误" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "服务器错误" });
  }
});

// 获取当前用户信息
router.get("/profile", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "缺少token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "用户不存在" });
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "无效的token" });
  }
});

// 登出（前端删除token即可，这里仅示意）
router.post("/logout", (req, res) => {
  // 无需服务器端操作，前端删除token即可
  res.json({ message: "登出成功" });
});

module.exports = router;
