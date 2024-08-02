import React, { useState } from "react";
import { socket } from "../App";

const CommentSection = ({ playlistName, comments, onAddComment }) => {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    const newComment = { playlistName, comment };
    onAddComment(newComment);
    socket.emit("new_comment", newComment);
    setComment("");
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <div className="comments">
        {comments.map((c, index) => (
          <div key={index} className="comment">
            {c}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default CommentSection;
