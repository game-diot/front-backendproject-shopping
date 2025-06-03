// App主要组件，包含路由和UserContextProvider
// 引入所需的库和组件
import "./App.css";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import IndexPage from "./components/pages/IndexPage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import { UserContextProvider } from "./components/UserContext";
import CreatePost from "./components/pages/CreatePostPage";
import PostPage from "./components/pages/PostPage";
import EditPost from "./components/pages/EditPostPage";
// 设置axios的默认请求地址和跨域请求
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
// App组件的JSX
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/create" element={<CreatePost />}></Route>
          <Route path="/post/:id" element={<PostPage />}></Route>
          <Route path="/edit/:id" element={<EditPost />}></Route>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
