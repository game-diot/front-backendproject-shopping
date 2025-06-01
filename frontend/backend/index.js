app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // 逻辑判断 用户名 邮箱 密码 不能为空 否则返回错误信息
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    // 分别检查用户名和邮箱是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "用户名已被使用" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "邮箱已被注册" });
    }

    // 创建新用户
    const userDoc = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: "用户名或密码错误" });
    }

    // 验证密码
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      return res.status(400).json({ error: "用户名或密码错误" });
    }

    // 登录成功，设置 cookie
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "服务器错误，请稍后重试" });
  }
});
