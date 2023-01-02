import { FaThumbsUp } from "react-icons/fa";
import { useState } from "react";
import "./like.css";

const Like = () => {
  const [like, setLike] = useState(false);

  return (
    <div className="like">
      <h1>Like Button Animation</h1>
      <div
        className="main_container"
        style={{
          background: like && "#5a89e5",
        }}
        onClick={() => setLike(!like)}
      >
        <FaThumbsUp
          style={{
            color: !like ? "#333" : "#fff",
          }}
          size={42}
        />
        <div
          className="text_container"
          style={{
            color: like && "#fff",
          }}
        >
          {like ? "Liked" : "Like"}
        </div>
      </div>
    </div>
  );
};

export default Like;
