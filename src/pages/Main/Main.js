import React, { useState, useEffect } from "react";
import axios from "axios";

import ListItem from "../../components/ListItem";

function Main({ isValidSession, history }) {
  const params = localStorage.getItem("params");
  const token = JSON.parse(params).access_token;
  const [playlists, setPlaylists] = useState([]);

  console.log(playlists);
  if (!isValidSession()) history.push("/");

  useEffect(() => {
    axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => setPlaylists(res.data.items))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <>
      <div className="playlists-top">
        {playlists.map((item) => {
          return <ListItem image={item.images} title={item.name} />;
        })}
      </div>
      <div className="tracklist-container">
        <div className="tracklist">
          <ul>Tracklist 1</ul>
        </div>
        <div className="tracklist">
          <ul>Tracklist 2</ul>
        </div>
      </div>
    </>
  );
}

export default Main;
