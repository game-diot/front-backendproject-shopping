// 数据库连接相关代码
const mongoose = require("mongoose");
require("dotenv").config();
// 导入 dotenv 并加载 .env 文件中的环境变量

// 连接数据库，并返回连接对象
const connectDB = async () => {
  try {
    // 使用环境变量中的 MONGO_URI 连接到 MongoDB
    const conn = await mongoose.connect(
      // process是一个全局对象，它包含有关当前 Node.js 进程的信息和控制
      // process.env 是一个对象，包含了当前进程的环境变量。
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Create-post",
      {
        // 这里是连接数据库的配置选项，分别是用于指定是否使用新的Url解析器和新的服务器发现和监视引擎
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // 连接成功后，输出连接成功的信息
    console.log(`Connected to MongoDB successfully: ${conn.connection.host}`);
  } catch (err) {
    // 连接失败后，输出错误信息并退出进程
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

// 导出连接数据库的函数
module.exports = connectDB;
