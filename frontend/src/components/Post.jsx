// post组件,用于显示文章列表
// 引入所需的库和组件,formatISO9075用于格式化日期,link用于创建链接
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

// 构建文章列表组件,接收文章数据作为props,用于显示文章列表
export default function Post({
  _id,
  title,
  summary,
  imageUrl,
  createdAt,
  author,
}) {
  // 返回文章列表的JSX结构
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={imageUrl} alt={title} />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p>
          <span>{author?.username || "未知用户"}</span>
          <time dateTime={formatISO9075(new Date(createdAt))}>
            {formatISO9075(new Date(createdAt))}
          </time>
        </p>
        <p>{summary}</p>
      </div>
    </div>
  );
}
