import "./App.css";
// import Post from "./Post";
// import Header from "./Header";
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
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

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
