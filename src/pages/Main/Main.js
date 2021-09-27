import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { IoAddCircleOutline } from "react-icons/io5";
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
  
  // get users playlist at start of session
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

  // get tracklist of a playlist
  const getTracklist = (url, column) => {
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setTracklists((prevLists) => {
          return prevLists.map((tracklist, i) => {
            if (i === column) return { ...tracklist, list: res.data.items };
            return tracklist;
          });
        });
      })
      .catch((err) => console.log(err));
  };

  // handle drag&drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    // const list = Array.from(todoList);
    // const [reorderedList] = list.splice(result.source.index, 1);
    // list.splice(result.destination.index, 0, reorderedList);
    // setTodoList(list);
  };
  return (
    <>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="playlist-results">
            {(provided) => (
              <ul
                className="playlists-top"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {playlists.map((item, index) => {
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          onClick={() => getTracklist(item.tracks.href, 0)}
                        >
                            <PlaylistItem
                              image={item.images}
                              title={item.name}
                            />                            
                        </li>
                      )}
                    </Draggable>
                  )
                })}

                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      <div className="tracklist-container">
        {tracklists.map((trackobj, i) => {
          return (
            <div key={"tracklist-" + i} className="tracklist">
              {trackobj.list.length > 0 ? (
                trackobj.list.map((item) => {
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
                  Drop a Playlist <IoAddCircleOutline />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Main;
