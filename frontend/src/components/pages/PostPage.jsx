// Post页面，用于显示文章详情
// 引入所需的库和组件
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
//format用于格式化日期，zhCN用于格式化日期为中文
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import ConfirmModal from "../ConfirmModal";
// Post页面组件
export default function PostPage() {
  // 声明状态变量和状态更新函数,文章,是否显示删除模态框,文章ID,跳转函数,用户信息
  const [post, setPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // 当组件挂载时,发送HTTP请求获取文章详情，id作为参数
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/post/${id}`);
        setPost(response.data);
        console.log("[PostPage] Received post data:", response.data);
        console.log("[PostPage] Image URL:", response.data.imageUrl);
      } catch (error) {
        console.error("获取文章失败:", error);
      }
    };
    fetchPost();
  }, [id]);

  // 显示删除模态框按钮函数
  const handleDeleteButtonClick = () => {
    setShowDeleteModal(true);
  };

  // 点击删除按钮时,发送HTTP请求删除文章,id作为参数
  const handleConfirmDelete = async () => {
    setShowDeleteModal(false); // 关闭模态框
    try {
      const response = await axios.delete(`http://localhost:4000/post/${id}`, {
        withCredentials: true,
      });
      if (response.data.message) {
        navigate("/"); // 删除成功后跳转到主页
      }
    } catch (error) {
      console.error("删除文章失败:", error);
      alert(error.response?.data?.error || "删除文章失败，请稍后重试"); // 显示后端返回的错误信息
    }
  };

  //点击模态框的取消按钮时执行函数
  const handleCancelDelete = () => {
    setShowDeleteModal(false); // 关闭模态框
  };
  // 如果文章不存在,返回null
  if (!post) return null;
  // 获取图片URL函数
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `http://localhost:4000/uploads/${path}`;
  };
  // 返回Post文章详情的JSX
  return (
    <div className="post-page">
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-info">
          <div className="post-author">
            <img
              src={
                post.author && post.author.avatar
                  ? getImageUrl(post.author.avatar)
                  : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23646cff'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E"
              }
              alt={post.author.username}
            />
            <span>{post.author.username}</span>
          </div>
          <div className="post-date">
            {format(new Date(post.createdAt), "yyyy年MM月dd日 HH:mm", {
              locale: zhCN,
            })}
          </div>
        </div>
      </div>

      {post.imageUrl && (
        <img className="post-cover" src={post.imageUrl} alt={post.title} />
      )}

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {user &&
        post.author &&
        user.id === String(post.author._id) && ( // 注意这里 post.author._id 可能是 ObjectId 类型，需要转成字符串比较
          <div className="post-actions">
            <Link to={`/edit/${post._id}`} className="edit-button">
              编辑文章
            </Link>
            {/* ✅ 修改这里：点击按钮时显示模态框，而不是直接删除 */}
            <button onClick={handleDeleteButtonClick} className="delete-button">
              删除文章
            </button>
          </div>
        )}

      {/* ✅ 渲染自定义确认模态框 */}
      {showDeleteModal && (
        <ConfirmModal
          message="确定要删除这篇文章吗？此操作不可撤销！"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}
