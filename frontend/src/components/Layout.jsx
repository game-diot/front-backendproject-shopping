// Layout组件,用于包裹整个应用程序
// 引入所需的库和组件Outlet用于渲染嵌套路由
import Header from "./Header";
import { Outlet } from "react-router-dom";

// 布局组件
export default function Layout() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}
