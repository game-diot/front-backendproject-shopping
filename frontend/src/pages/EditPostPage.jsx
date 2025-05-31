import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../components/UserContext";

export default function EditPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState("");
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/post/${id}`)
      .then((response) => {
        const postInfo = response.data;
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      })
      .catch((error) => {
        console.error("Failed to fetch post:", error);
      });
  }, []);

  async function updatePost(e) {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("id", id);
    if (file?.[0]) {
      data.set("file", file[0]);
    }

    try {
      await axios.put("http://localhost:4000/post", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // axios 会自动设置正确的 boundary
        },
      });
      setRedirect(true);
    } catch (error) {
      console.error("Failed to update post:", error);
      setErrorMsg("Update failed");
    } finally {
      setLoading(false);
    }
  }
  if (redirect) {
    return <Navigate to={"/post/" + id} />;
  }

  return (
    <form className="edit-post-form" onSubmit={updatePost}>
      <input
        className="edit-title-input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="edit-summary-input"
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        required
      />
      <input
        className="edit-file-input"
        type="file"
        onChange={(e) => setFile(e.target.files)}
      />
      <Editor value={content} onChange={setContent} />
      <button className="edit-submit-btn" disabled={loading}>
        {loading ? "Updating..." : "Update Post"}
      </button>
      {errorMsg && <div className="error edit-error-msg">{errorMsg}</div>}
    </form>
  );
}
