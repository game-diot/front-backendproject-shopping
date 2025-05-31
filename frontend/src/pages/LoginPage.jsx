import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import axios from "axios";

export default function LoginPage() {
  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function login(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        {
          identifier: username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setUser(response.data);
      setRedirect(true);
    } catch (error) {
      alert("wrong credentials");
      console.error("Login error:", error);
    }
  }
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="login-form" onSubmit={login}>
      <h2 className="login-title"></h2>
      <input
        className="login-username-input"
        type="text"
        placeholder="username or email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="login-password-input"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-btn">Login</button>
    </form>
  );
}
