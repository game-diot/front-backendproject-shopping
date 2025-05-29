const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../middleware/authMiddleware");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "用户名、邮箱和密码都是必需的" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ error: "用户名或邮箱已存在" });
    }

    const salt = bcrypt.genSaltSync(10);
    const userDoc = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt)
    });

    res.json({
      id: userDoc._id,
      username: userDoc.username
    });
  } catch (err) {
    console.error("注册错误:", err);
    res.status(500).json({ error: "服务器内部错误" });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "用户名/邮箱和密码都是必需的" });
    }

    const userDoc = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!userDoc) {
      return res.status(400).json({ error: "用户名/邮箱或密码无效" });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        username: userDoc.username,
        id: userDoc._id
      }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax"
        }).json({
          id: userDoc._id,
          username: userDoc.username
        });
      });
    } else {
      res.status(400).json({ error: "用户名/邮箱或密码无效" });
    }
  } catch (err) {
    console.error("登录错误:", err);
    res.status(500).json({ error: "服务器内部错误" });
  }
};

module.exports = { register, login };