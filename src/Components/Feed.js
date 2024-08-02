import React from 'react';
import Playlist from './Playlist';

const Feed = ({ playlists }) => {
  return (
    <div className="feed">
      {playlists.map((playlist, index) => (
        <Playlist key={index} playlist={playlist} />
      ))}
    </div>
  );
};

export default Feed;
