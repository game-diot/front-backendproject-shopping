# 博客系统项目文档

## 项目概述

这是一个使用 MERN（MongoDB、Express、React、Node.js）技术栈开发的全栈博客系统，支持用户注册、登录、发布文章、编辑文章等功能。

## 技术栈

### 前端技术

- React：用于构建用户界面
- React Router：处理前端路由
- Axios：处理 HTTP 请求
- Markdown 编辑器：支持 Markdown 格式文章编写
- Context API：管理用户状态

### 后端技术

- Node.js & Express：构建 Web 服务器
- MongoDB & Mongoose：数据库及 ORM
- JWT：用户认证
- bcryptjs：密码加密
- multer：处理文件上传

## 功能特性

### 用户管理

1. 用户注册

   - 用户名、邮箱唯一性验证
   - 密码加密存储
   - 表单验证

2. 用户登录
   - 支持用户名/邮箱登录
   - JWT token 认证
   - 登录状态持久化

### 文章管理

1. 文章发布

   - Markdown 编辑器支持
   - 封面图片上传
   - 文章标题、摘要、内容管理

2. 文章操作
   - 查看文章列表
   - 查看文章详情
   - 编辑文章
   - 删除文章

## 项目结构

### 前端结构

```
frontend/
├── src/
│   ├── components/        # 可复用组件
│   │   ├── Editor.jsx     # Markdown编辑器组件
│   │   ├── Header.jsx     # 页面头部组件
│   │   ├── Layout.jsx     # 布局组件
│   │   ├── Post.jsx       # 文章卡片组件
│   │   └── UserContext.jsx # 用户状态管理
│   ├── pages/             # 页面组件
│   │   ├── CreatePostPage.jsx  # 创建文章页面
│   │   ├── EditPostPage.jsx    # 编辑文章页面
│   │   ├── IndexPage.jsx       # 首页
│   │   ├── LoginPage.jsx       # 登录页面
│   │   ├── PostPage.jsx        # 文章详情页面
│   │   └── RegisterPage.jsx    # 注册页面
│   └── App.jsx            # 应用主组件
```

### 后端结构

```
backend/
├── config/
│   └── db.js              # 数据库配置
├── controllers/
│   ├── authController.js   # 用户认证控制器
│   └── postController.js   # 文章管理控制器
├── middleware/
│   ├── authMiddleware.js   # 认证中间件
│   └── uploadMiddleware.js # 文件上传中间件
├── models/
│   ├── Post.js            # 文章数据模型
│   └── User.js            # 用户数据模型
├── routes/
│   ├── authRouter.js      # 认证相关路由
│   └── postRouter.js      # 文章相关路由
├── utils/
│   └── jwt.js             # JWT工具函数
└── server.js              # 服务器入口文件
```

## API 接口

### 认证接口

- POST `/register` - 用户注册
- POST `/login` - 用户登录
- GET `/profile` - 获取用户信息
- POST `/logout` - 用户登出

### 文章接口

- POST `/post` - 创建文章
- GET `/post` - 获取文章列表
- GET `/post/:id` - 获取文章详情
- PUT `/post/:id` - 更新文章
- DELETE `/post/:id` - 删除文章

## 安全特性

1. 密码加密：使用 bcryptjs 进行密码哈希
2. JWT 认证：使用 JWT 进行用户身份验证
3. 跨域保护：配置 CORS 策略
4. 文件上传限制：限制上传文件类型和大小
5. 数据验证：前后端都进行数据验证

## 部署说明

### 前端部署

1. 安装依赖：

```bash
cd frontend
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

### 后端部署

1. 安装依赖：

```bash
cd backend
npm install
```

2. 配置环境变量：

- 创建`.env`文件
- 设置必要的环境变量（MongoDB 连接串、JWT 密钥等）

3. 启动服务器：

```bash
npm start
```

## 注意事项

1. 确保 MongoDB 服务已启动
2. 前端默认运行在`http://localhost:5173`
3. 后端默认运行在`http://localhost:4000`
4. 确保上传目录`backend/uploads`存在且有写入权限
