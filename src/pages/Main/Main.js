import React, { useState, useEffect } from "react";
import axios from "axios";
import { GrAddCircle } from "react-icons/gr";
import PlaylistItem from "../../components/PlaylistItem";
import TracklistItem from "../../components/TracklistItem";

function Main({ isValidSession, history }) {
  const params = localStorage.getItem("params");
  const token = JSON.parse(params).access_token;
  const [playlists, setPlaylists] = useState([]);
  const [tracklists, setTracklists] = useState([
    { list: [], loading: false },
    { list: [], loading: false },
  ]);
  // const [tracklistLeft, setTracklistLeft] = useState([]);
  // const [tracklistRight, setTracklistRight] = useState([]);

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

  const getPlaylist = (url, column) => {
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setTracklists((prevLists) => {
          return prevLists.map((tracklist, i) => {
            if (i === column)  return { ...tracklist, list: res.data.items };
             return tracklist;
          });
        });
        console.log(tracklists);
      })
      .catch((err) => console.log(err));
  };
  // console.log(tracklistLeft);
  return (
    <>
      <div className="playlists-top">
        {playlists.map((item) => {
          return (
            <div
              onClick={() => getPlaylist(item.tracks.href, 0)}
              onDoubleClick={() => getPlaylist(item.tracks.href, 1)}
              key={item.id}
            >
              <PlaylistItem image={item.images} title={item.name} />;
            </div>
          );
        })}
      </div>
      <div className="tracklist-container">
        {tracklists.map((trackobj, i) => {
          return (
            <div key={"tracklist-" + i} className="tracklist">
              {trackobj.list.length > 0 ? (
                trackobj.list.map((item) => {
                  console.log(item);
                  return (
                    <TracklistItem
                      key={item.track.id}
                      image={item.track.album.images}
                      title={item.track.name}
                      artists={item.track.artists}
                    />
                  );
                })
              ) : (
                <div className="tracklist-placeholder">
                  {" "}
                  Drop a Playlist <GrAddCircle />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* <div className="tracklist">
          {tracklistLeft.length > 0 ? (
            tracklistLeft.map((item) => {
              console.log(item);
              return (
                <TracklistItem
                  key={item.track.id}
                  image={item.track.album.images}
                  title={item.track.name}
                  artists={item.track.artists}
                />
              );
            })
          ) : (
            <div className="tracklist-placeholder">
              {" "}
              Drop a Playlist <GrAddCircle />
            </div>
          )}
        </div>
        <div className="tracklist">
          {tracklistRight.map((item) => {
            console.log(item);
            return (
              <TracklistItem
                key={item.track.id}
                image={item.track.album.images}
                title={item.track.name}
                artists={item.track.artists}
              />
            );
          })}
        </div>
      </div> */}
    </>
  );
}

export default Main;
