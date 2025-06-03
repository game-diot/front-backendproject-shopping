// UserContext Hook,用于管理用户状态
import { createContext, useState } from "react";
// 使用createContext创建存储用户状态数据的箱子,可使得组件之间共享数据
export const UserContext = createContext({});
export function UserContextProvider(props) {
  // 存储用户状态数据
  const [user, setUser] = useState({});
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
}
