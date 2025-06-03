// 注册页面,用于注册新用户
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

// 注册页面
export default function RegisterPage() {
  // 状态变量和状态更新函数,密码,用户名,邮箱,跳转状态,错误信息
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

  // 定义注册函数
  async function register(e) {
    e.preventDefault();
    setError("");

    // 表单验证
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("请填写所有必填字段");
      return;
    }

    // 打印请求数据
    console.log("Register request data:", {
      username,
      email,
      password: "***",
    });

    try {
      // 发送注册请求
      const response = await axios.post(
        "http://localhost:4000/register",
        {
          username,
          email,
          password,
        },
        {
          // 发送请求时携带凭据
          withCredentials: true,
        }
      );

      console.log("Register response:", response.data);

      if (response.data) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Register failed:", error);
      // 打印详细的错误信息
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        setError(error.response.data.error || "注册失败，请稍后重试");
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("网络请求失败，请检查网络连接");
      } else {
        console.error("Error message:", error.message);
        setError("注册失败，请稍后重试");
      }
    }
  }
  // 注册成功后跳转到登录页面
  if (redirect) {
    return <Navigate to="/login" />;
  }
  // 渲染注册页面
  return (
    <div className="form-container">
      <form className="form login-form" onSubmit={register}>
        <h2 className="login-title">注册账号</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button>注册</button>
        <div className="form-footer">
          已有账号？ <Link to="/login">立即登录</Link>
        </div>
      </form>
    </div>
  );
}
