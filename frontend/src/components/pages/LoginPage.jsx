// 登录页面组件,用于用户登录
// 引入所需的库和组件
import { useState, useContext } from "react";
// Navigate用于页面跳转,Link用于创建链接
import { useNavigate, Link, Navigate } from "react-router-dom";
// axios用于发送HTTP请求
import axios from "axios";
// UserContext用于管理用户状态
import { UserContext } from "../UserContext";

// 登录页面组件
export default function LoginPage() {
  // 声明状态变量和状态更新函数,用户名,密码,跳转状态,错误信息,加载状态
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // 使用useContext获取UserContext中的setUser函数
  const { setUser } = useContext(UserContext);

  // 定义登录函数,表单要求
  async function login(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 表单验证逻辑
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
      // 发送登录请求
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
      // 登录成功,更新用户状态
      if (response.data) {
        setUser(response.data);
        setRedirect(true);
      }
    } catch (error) {
      // 登录失败,更新错误信息,并打印错误信息
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

  // 如果redirect为true,则跳转到首页
  if (redirect) {
    return <Navigate to="/" />;
  }

  // 渲染登录页面
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
