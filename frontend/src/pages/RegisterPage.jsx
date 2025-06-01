import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");

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
      password: "***", // 不打印实际密码
    });

    try {
      const response = await axios.post(
        "http://localhost:4000/register",
        {
          username,
          email,
          password,
        },
        {
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

  if (redirect) {
    return <Navigate to="/login" />;
  }

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
