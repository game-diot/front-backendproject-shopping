import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

// 构建组件Header 并导出
export default function Header() {
  // 从UserContext中解构出userInfo和setUserInfo
  const { user, setUser } = useContext(UserContext);
  //   使用useEffect钩子来获取用户信息
  useEffect(() => {
    // 发送GET请求到服务器端的/profile接口
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
        console.error("Failed to fetch profile:", error);
      });
  }, []);
  // 定义logout函数，用于发送POST请求到服务器端的/logout接口
  function logout() {
    axios
      .post(
        "http://localhost:4000/logout",
        {},
        {
          withCredentials: true,
        }
      )
      //     成功响应后，将userInfo状态设置为null
      .then(() => {
        setUser(null);
      })
      //     失败响应后，打印错误信息
      .catch((error) => {
        console.error("Logout failed:", error);
      });
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
              Create Post
            </Link>
            <button className="nav-link logout-btn" onClick={logout}>
              Logo({username})ut
            </button>
          </>
        )}
        {!username && (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
