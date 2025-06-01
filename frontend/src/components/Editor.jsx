import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect } from "react";

export default function EditorComponent({ value, onChange }) {
  const [markdown, setMarkdown] = useState(value || "");

  useEffect(() => {
    onChange(markdown);
  }, [markdown, onChange]);

  return (
    <div className="editor-wrapper" data-color-mode="light">
      <MDEditor
        value={markdown}
        onChange={setMarkdown}
        height={400}
        preview="edit"
        hideToolbar={false}
        enableScroll={true}
        textareaProps={{
          placeholder: "请输入文章内容...",
        }}
      />
    </div>
  );
}
