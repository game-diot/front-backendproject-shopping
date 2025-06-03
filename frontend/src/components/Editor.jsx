// Editor组件,用于编辑文章
// 引入所需的库和组件,  MDEditor用于编辑Markdown文本
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect } from "react";

// Editor组件,接收value和onChange作为props,文章内容和编辑内容的回调函数
export default function EditorComponent({ value, onChange }) {
  // 声明状态变量和状态更新函数,markdown,文章内容
  const [markdown, setMarkdown] = useState(value || "");
  useEffect(() => {
    onChange(markdown);
  }, [markdown, onChange]);

  // 返回编辑组件
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
