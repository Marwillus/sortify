import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { IoAddCircleOutline } from "react-icons/io5";
import PlaylistItem from "../../components/PlaylistItem";
import TracklistItem from "../../components/TracklistItem";

// change style of elements while interaction

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver
    ? "rgba(255, 255, 255, 0.1)"
    : "none",
});
const getItemStyle = (isDragging, draggableStyle) => ({
  background: isDragging
    ? "rgba(21, 245, 21, 0.342)"
    : "rgba(255, 206, 86, 0.05)",
  // styles we need to apply on draggables
  ...draggableStyle,
});

function Main({ isValidSession, history }) {
  const params = localStorage.getItem("params");
  const token = JSON.parse(params).access_token;

  const [playlistResult, setPlaylistResult] = useState([]);
  const [playlists, setPlaylists] = useState([
    { list: [], loading: false },
    { list: [], loading: false },
  ]);

  // console.log(playlistResult);

  if (!isValidSession()) history.push("/");

  // get users playlist at start of session
  useEffect(() => {
    axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => setPlaylistResult(res.data.items))
      .catch((err) => console.log(err));
  }, [token]);

  // get tracklist of a playlist and put it in the right column
  const getTracklist = (playlistData, column) => {
    const tracklistUrl = playlistData.tracks.href;
    axios
      .get(tracklistUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setPlaylists((prevLists) => {
          return prevLists.map((tracklist, i) => {
            if (i === column)
              return { ...tracklist, list: res.data.items, data: playlistData };
            return tracklist;
          });
        });
      })
      .catch((err) => console.log(err));
  };

  // reorder listItem
  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // handle drag&drop
  const handleOnDragEnd = (result) => {
    // console.table(result);
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (result.source.droppableId === "playlists-top") {
      if (result.destination.droppableId === result.source.droppableId) {
        const items = reorder(playlistResult, sourceIndex, destinationIndex);
        setPlaylistResult(items);
      } else {
        const playlistPosition = parseInt(
          result.destination.droppableId.slice(-1)
        );
        const selectedPlaylist = [...playlistResult].splice(sourceIndex, 1)[0];
        getTracklist(selectedPlaylist, playlistPosition);
      }
    } else {
      const playlistPosition = result.destination.droppableId.slice(-1);
      if (result.destination.droppableId === result.source.droppableId) {
        const items = reorder(
          playlists[playlistPosition].list,
          result.source.index,
          result.destination.index
        );
        const newPlaylists = [...playlists];
        newPlaylists[playlistPosition].list = items;
        setPlaylists(newPlaylists);
      }
    }
  };
  const handleOnDragStart = (result) => {
    console.log(result);
  }

  // render main /////////////////////////////////////
  return (
    <>
      <DragDropContext onDragStart={handleOnDragStart} onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="playlists-top" direction="horizontal">
          {(provided, snapshot) => (
            <ul
              className="playlists-top"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {playlistResult.map((item, index) => {
                return (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        className="playlist-item"
                        onClick={() => getTracklist(item.tracks.href, 0)}
                      >
                        <PlaylistItem image={item.images} title={item.name} />
                      </li>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </ul>
          )}
        </Droppable>
        <div className="tracklist-container">
          {playlists.map((playlist, index) => {
            return (
              <div className="tracklist">
                <h3 className="tracklist-header">{playlist.data?.name}</h3>
                <Droppable
                  key={"section-" + index}
                  droppableId={"playlist-" + index}
                  // change this later when preventing dropping playlists in tracklist
                  isDropDisabled={false}
                >
                  {(provided, snapshot) => (
                    <ul
                      className={"tracklist-content playlist-" + index }
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {playlist.list.length > 0 ? (
                        playlist.list.map((item, index) => {
                          const track = item.track;
                          return (
                            <Draggable
                              key={track.id}
                              draggableId={track.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <li
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                  className="tracklist-item"
                                >
                                  <TracklistItem
                                    key={track.id}
                                    image={track.album.images}
                                    title={track.name}
                                    artists={track.artists}
                                  />
                                </li>
                              )}
                            </Draggable>
                          );
                        })
                      ) : (
                        <div className="tracklist-placeholder">
                          {" "}
                          Drop a Playlist <IoAddCircleOutline />
                        </div>
                      )}

                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
}

export default Main;
