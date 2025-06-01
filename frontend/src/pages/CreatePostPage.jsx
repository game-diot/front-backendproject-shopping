import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import axios from "axios";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { Navigate } from "react-router-dom";

const mdParser = new MarkdownIt();

export default function CreatePost() {
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
      // content: content.trim(), // 不打印完整内容
      hasFile: !!files[0],
    });

    const data = new FormData();
    data.set("title", title.trim());
    data.set("summary", summary.trim());
    // 将 Markdown 内容转换为 HTML 再发送
    const htmlContent = mdParser.render(content);
    data.set("content", htmlContent);
    if (files[0]) {
      data.set("file", files[0]);
    }

    try {
      console.log("Sending request to backend...");
      const response = await axios.post("http://localhost:4000/post", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

  if (redirect) {
    return <Navigate to="/" />;
  }

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
