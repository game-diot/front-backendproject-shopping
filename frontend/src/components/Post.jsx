import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  cover,
  coverUrl,
  createdAt,
  author,
}) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img
            src={coverUrl || `http://localhost:4000/uploads/${cover}`}
            alt={title}
          />
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
