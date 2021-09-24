import React, { useState, useEffect } from "react";
import axios from "axios";

import PlaylistItem from "../../components/PlaylistItem";
import TracklistItem from "../../components/TracklistItem";

function Main({ isValidSession, history }) {
  const params = localStorage.getItem("params");
  const token = JSON.parse(params).access_token;
  const [playlists, setPlaylists] = useState([]);
  const [tracklistLeft, setTracklistLeft] = useState([]);
  const [tracklistRight, setTracklistRight] = useState([]);

  if (!isValidSession()) history.push("/");
// console.log(playlists);
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

  const getPlaylist = (url, left) => {
    axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((res) => left?setTracklistLeft(res.data.items):setTracklistRight(res.data.items))
    .catch((err) => console.log(err));
  }
  // console.log(tracklistLeft);
  return (
    <>
      <div className="playlists-top">
        {playlists.map((item) => {
          return (<div onClick={()=>getPlaylist(item.tracks.href, true)} onDoubleClick={()=>getPlaylist(item.tracks.href, false)}>
          <PlaylistItem image={item.images} title={item.name} key={item.id} />;
          </div>)
        })}
      </div>
      <div className="tracklist-container">
        <div className="tracklist">
          {tracklistLeft.map((item)=>{
            console.log(item);
            return   <TracklistItem key={item.track.id} image={item.track.album.images} title={item.track.name} artists={item.track.artists}/>
          })}
        </div>
        <div className="tracklist">
        {tracklistRight.map((item)=>{
            console.log(item);
            return   <TracklistItem key={item.track.id} image={item.track.album.images} title={item.track.name} artists={item.track.artists}/>
          })}
        </div>
      </div>
    </>
  );
}

export default Main;
