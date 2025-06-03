import Post from "../Post";
import { useEffect, useState } from "react";
import axios from "axios";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
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
  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </>
  );
}
