//中间件文件,用于文件上传
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 定义上传文件的存储路径
const uploadsDir = path.join(__dirname, "../uploads");

// 判断 uploads 目录是否存在，如果不存在，则创建它
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置 multer，定义上传的文件存储方式
const storage = multer.diskStorage({
  // destination 方法定义了文件存储的路径
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // 回调函数的第一个参数为错误对象，如果没有错误，则传入 null
  },
  // filename 方法定义了文件存储的文件名
  filename: function (req, file, cb) {
    // 生成一个唯一的文件名，使用时间戳和随机数
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // 获取原始文件的扩展名
    cb(null, uniqueSuffix + ext);
  },
});

// 定义文件上传中间件，使用 multer 方法，传入上述 storage 对象
const uploadMiddleware = multer({
  storage: storage,
  // fileFilter 方法定义了文件的过滤规则，只允许上传 jpg、jpeg、png、gif 格式的文件
  fileFilter: (req, file, cb) => {
    // 使用 /i 进行不区分大小写的匹配，确保所有大小写的文件扩展名都能被识别
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(
        new Error(
          "Invalid file type. Only JPG, JPEG, PNG, and GIF image files are allowed!"
        ),
        false
      );
    }
    cb(null, true);
  },
  //限制文件大小5MB
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// 导出 uploadMiddleware 中间件
module.exports = uploadMiddleware;
