// Header组件,用于显示头部信息
// 引入所需的库和组件
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

// 构建组件Header 并导出
export default function Header() {
  // 从UserContext中解构出userInfo和setUserInfo
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  //   使用useEffect钩子来获取用户信息
  useEffect(() => {
    // 检查是否有 token
    const token = document.cookie.includes("token=");
    if (token) {
      axios
        .get("http://localhost:4000/profile", {
          // 发送请求时带上凭证
          withCredentials: true,
        })
        //   成功响应后，将响应数据中的userInfo设置到userInfo状态中
        .then((response) => {
          setUser(response.data);
        })
        //   失败响应后，打印错误信息
        .catch((error) => {
          console.error("获取用户信息失败:", error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  // 定义logout函数，用于发送POST请求到服务器端的/logout接口
  async function logout() {
    try {
      await axios.post(
        "http://localhost:4000/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("登出失败:", error);
      // 即使请求失败，也清除本地用户状态并重定向
      setUser(null);
      navigate("/");
    }
  }

  //   从userInfo中解构出username，用于下面的逻辑判断
  const username = user?.username;
  return (
    <header className="main-header">
      <Link to="/" className="logo">
        Logo
      </Link>
      <nav className="main-nav">
        {username && (
          <>
            <Link to="/create" className="nav-link">
              创建文章
            </Link>
            <button className="nav-link logout-btn" onClick={logout}>
              退出登录 ({username})
            </button>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="nav-link">
              登录
            </Link>
            <Link to="/register" className="nav-link">
              注册
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
