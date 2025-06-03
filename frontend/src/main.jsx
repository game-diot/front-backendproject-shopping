// main组件，用于创建根节点展示在html页面中
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// 引入reportWebVitals函数，用于收集性能指标
import reportWebVitals from "./reportWebVitals";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
// reportWebVitals函数，用于收集性能指标，例如页面加载时间、交互响应时间等
reportWebVitals();
