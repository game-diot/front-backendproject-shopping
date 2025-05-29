// 导入mongoose库
const mongoose = require("mongoose");
// 链接数据库
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Create-post", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected to Create-post database");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = { connectDB };
