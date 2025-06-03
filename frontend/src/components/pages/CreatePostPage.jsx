// CreatePost页面,用于创建新文章
// 引入所需的库和组件
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { Navigate } from "react-router-dom";
// 定义 Markdown 解析器
const mdParser = new MarkdownIt();
// 定义 CreatePost 组件
export default function CreatePost() {
  // 声明状态变量和状态更新函数,标题,摘要,内容,文件,跳转状态,标题错误信息,摘要错误信息,内容错误信息,文件错误信息,加载状态
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [contentError, setContentError] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  // 如果用户未登录，重定向到登录页面
  if (!user) {
    return <Navigate to="/login" />;
  }
  // 创建新文章的异步函数
  async function createNewPost(e) {
    e.preventDefault();
    setTitleError("");
    setSummaryError("");
    setContentError("");
    setFileError("");
    setLoading(true);

    // 表单验证
    let hasError = false;
    if (!title.trim()) {
      setTitleError("请输入文章标题");
      hasError = true;
    }
    if (!summary.trim()) {
      setSummaryError("请输入文章摘要");
      hasError = true;
    }
    // 对于 Markdown 编辑器，检查 content 是否为空或只包含空白字符
    if (!content || !content.trim()) {
      setContentError("请输入文章内容");
      hasError = true;
    }
    if (!files[0]) {
      setFileError("请选择文章封面图片");
      hasError = true;
    }
    if (hasError) {
      setLoading(false);
      return;
    }

    // 打印请求数据
    console.log("Create post request data:", {
      title: title.trim(),
      summary: summary.trim(),
      hasFile: !!files[0],
    });
    // 定义表单数据,包括标题,摘要,内容,文件
    const data = new FormData();
    data.set("title", title.trim());
    data.set("summary", summary.trim());
    // 将 Markdown 内容转换为 HTML 再发送
    const htmlContent = mdParser.render(content);
    data.set("content", htmlContent);
    if (files[0]) {
      data.set("file", files[0]);
    }
    // 发送 POST 请求到后端
    try {
      console.log("Sending request to backend...");
      const response = await axios.post("http://localhost:4000/post", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // 打印响应数据
      console.log("Create post response:", response.data);
      if (response.data) {
        setRedirect(true);
      } else {
        setContentError("创建文章失败，请稍后重试");
      }
    } catch (error) {
      console.error("Post creation failed:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        setContentError(
          error.response.data.error || "创建文章失败，请稍后重试"
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        setContentError("网络连接失败，请检查网络连接");
      } else {
        console.error("Error message:", error.message);
        setContentError("创建文章失败，请稍后重试");
      }
    } finally {
      setLoading(false);
    }
  }
  // 创建完成后跳转到首页
  if (redirect) {
    return <Navigate to="/" />;
  }
  // 渲染 CreatePost 组件
  return (
    <div className="form-container">
      <form className="form" onSubmit={createNewPost}>
        <h2>创建新文章</h2>
        <div className="form-group">
          <label htmlFor="title">文章标题</label>
          <input
            id="title"
            type="text"
            placeholder="请输入文章标题"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) {
                setTitleError("");
              }
            }}
            className={titleError ? "error" : ""}
            required
          />
          {titleError && <div className="error-message">{titleError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="summary">文章摘要</label>
          <input
            id="summary"
            type="text"
            placeholder="请输入文章摘要"
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              if (e.target.value.trim()) {
                setSummaryError("");
              }
            }}
            className={summaryError ? "error" : ""}
            required
          />
          {summaryError && <div className="error-message">{summaryError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="cover">封面图片</label>
          <input
            id="cover"
            type="file"
            onChange={(e) => {
              setFiles(e.target.files);
              if (e.target.files[0]) {
                setFileError("");
              } else {
                setFileError("请选择文章封面图片");
              }
            }}
            accept="image/*"
            className={fileError ? "error" : ""}
            required
          />
          {fileError && <div className="error-message">{fileError}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="content">文章内容</label>
          <div className={`editor-container ${contentError ? "error" : ""}`}>
            <MdEditor
              value={content}
              style={{ height: 300 }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={({ text }) => {
                setContent(text);
                if (text && text.trim()) {
                  setContentError("");
                }
              }}
              placeholder="请输入文章内容，支持 Markdown 语法"
            />
          </div>
          {contentError && <div className="error-message">{contentError}</div>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "发布中..." : "发布文章"}
        </button>
      </form>
    </div>
  );
}
