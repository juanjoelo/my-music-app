import React, { useState } from 'react';
import CommentSection from './CommentSection';

const Playlist = ({ playlist }) => {
  const [likes, setLikes] = useState(playlist.likes || 0);
  const [comments, setComments] = useState(playlist.comments || []);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleAddComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <div className="playlist">
      <h2>{playlist.name}</h2>
      <p>{playlist.description}</p>
      <button onClick={handleLike}>Like ({likes})</button>
      <CommentSection comments={comments} onAddComment={handleAddComment} />
    </div>
  );
};

export default Playlist;
