// EditPost页面，用于编辑文章
// 引入所需的库和组件
import { useEffect, useState, useContext } from "react";
// Param用于获取路由参数,Navigate用于页面跳转
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
// TurndownService用于将 HTML 转换为 Markdown
import TurndownService from "turndown";
// 定义 Markdown 解析器
const mdParser = new MarkdownIt();
const turndownService = new TurndownService();
// 定义 EditPost 组件
export default function EditPost() {
  // 声明状态变量和状态更新函数,标题,摘要,内容,文件,当前封面,标题错误信息,摘要错误信息,内容错误信息,文件错误信息,加载状态
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [currentCover, setCurrentCover] = useState("");
  const [titleError, setTitleError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [contentError, setContentError] = useState("");
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  // 使用useEffect钩子在组件挂载后获取文章数据，id作为参数
  useEffect(() => {
    // 定义异步函数fetchPost,用于获取文章数据
    const fetchPost = async () => {
      try {
        // 发送 GET 请求获取文章数据
        const response = await axios.get(`http://localhost:4000/post/${id}`);
        const postData = response.data;
        setTitle(postData.title);
        setSummary(postData.summary);
        // 将 HTML 内容转换为 Markdown
        const markdownContent = turndownService.turndown(postData.content);
        setContent(markdownContent);
        if (postData.cover) {
          setCurrentCover(`http://localhost:4000/uploads/${postData.cover}`);
        }
      } catch (error) {
        console.error("获取文章失败:", error);
        setContentError("获取文章失败，请稍后重试");
      }
    };
    fetchPost();
  }, [id]);

  // 更新文章
  async function updatePost(e) {
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
    if (!content || !content.trim()) {
      setContentError("请输入文章内容");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }
    // 定义表单数据标题,摘要,内容,文件
    const data = new FormData();
    data.set("title", title.trim());
    data.set("summary", summary.trim());
    // 在发送数据前将 Markdown 转换回 HTML
    const htmlContent = mdParser.render(content);
    data.set("content", htmlContent);
    // 如果有文件,将文件添加到表单数据
    if (files[0]) {
      data.set("file", files[0]);
    }
    // 发送 PUT 请求更新文章
    try {
      console.log("正在更新文章，ID:", id);
      console.log("更新数据:", {
        title: title.trim(),
        summary: summary.trim(),
        hasFile: !!files[0],
      });
      const response = await axios.put(
        `http://localhost:4000/post/${id}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // 如果更新成功,跳转至文章详情页
      if (response.data) {
        navigate(`/post/${id}`);
      } else {
        setContentError("更新文章失败，请稍后重试");
      }
    } catch (error) {
      console.error("更新文章失败:", error);
      if (error.response) {
        setContentError(
          error.response.data.error || "更新文章失败，请稍后重试"
        );
      } else if (error.request) {
        setContentError("网络连接失败，请检查网络设置");
      } else {
        setContentError("更新文章失败，请稍后重试");
      }
    } finally {
      setLoading(false);
    }
  }
  // 如果未登录,跳转至登录页
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 渲染编辑文章表单jsx
  return (
    <div className="form-container">
      <form className="form" onSubmit={updatePost}>
        <h2>编辑文章</h2>
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
          {currentCover && (
            <div className="current-cover">
              <img src={currentCover} alt="当前封面" />
              <span>当前封面</span>
            </div>
          )}
          <input
            id="cover"
            type="file"
            onChange={(e) => {
              setFiles(e.target.files);
              if (e.target.files[0]) {
                setFileError("");
              }
            }}
            accept="image/*"
            className={fileError ? "error" : ""}
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
              onChange={({ text }) => setContent(text)}
              placeholder="请输入文章内容，支持 Markdown 语法"
            />
          </div>
          {contentError && <div className="error-message">{contentError}</div>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "更新中..." : "更新文章"}
        </button>
      </form>
    </div>
  );
}
