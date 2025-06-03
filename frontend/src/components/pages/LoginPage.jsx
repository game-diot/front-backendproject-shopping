import { useState, useContext } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  async function login(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 表单验证
    if (!username.trim() || !password.trim()) {
      setError("请填写用户名和密码");
      setLoading(false);
      return;
    }

    // 打印请求数据
    const loginData = {
      identifier: username.trim(),
      password: password.trim(),
    };
    console.log("Login request data:", { ...loginData, password: "***" });

    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        loginData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", response.data);

      if (response.data) {
        setUser(response.data);
        setRedirect(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        setError(error.response.data.error || "登录失败，请稍后重试");
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("网络连接失败，请检查网络设置");
      } else {
        console.error("Error message:", error.message);
        setError("登录失败，请稍后重试");
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
      <form className="form login-form" onSubmit={login}>
        <h2 className="login-title">登录</h2>
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
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button disabled={loading}>{loading ? "登录中..." : "登录"}</button>
        <div className="form-footer">
          还没有账号？ <Link to="/register">立即注册</Link>
        </div>
      </form>
    </div>
  );
}
