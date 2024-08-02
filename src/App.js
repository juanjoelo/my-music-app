import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Feed from "./Components/Feed";
import "./App.css";

const socket = io("http://localhost:4000");

const App = () => {
  const [playlists, setPlaylists] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    const refresh = params.get("refresh_token");

    if (token) {
      setAccessToken(token);
      setRefreshToken(refresh);
      fetchPlaylists(token);
    }

    socket.on("new_comment", (data) => {
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.name === data.playlistName
            ? { ...playlist, comments: [...playlist.comments, data.comment] }
            : playlist
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchPlaylists = async (token) => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlaylists(
        response.data.items.map((playlist) => ({
          ...playlist,
          likes: 0,
          comments: [],
        }))
      );
    } catch (error) {
      console.error("Error fetching playlists", error);
    }
  };

  const handleLogin = () => {
    window.location = "http://localhost:8888/login";
  };

  return (
    <div className="App">
      <h1>Music Feed</h1>
      {!accessToken ? (
        <button onClick={handleLogin}>Login with Spotify</button>
      ) : (
        <Feed playlists={playlists} />
      )}
    </div>
  );
};

export default App;
