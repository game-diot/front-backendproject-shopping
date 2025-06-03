// Index页面，用于展示文章列表
// 引入所需的库和组件
import Post from "../Post";
import { useEffect, useState } from "react";
import axios from "axios";

// Index页面组件
export default function IndexPage() {
  // 声明状态变量和状态更新函数,文章列表
  const [posts, setPosts] = useState([]);
  // 使用useEffect钩子,在组件挂载时发送HTTP请求获取文章列表，
  useEffect(() => {
    axios
      .get("http://localhost:4000/post")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("获取文章列表失败:", error);
      });
  }, []);
  // 渲染文章列表
  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </>
  );
}
