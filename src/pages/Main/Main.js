import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { IoAddCircleOutline } from "react-icons/io5";
import PlaylistItem from "../../components/PlaylistItem";
import TracklistItem from "../../components/TracklistItem";

  // change style of elements while interaction

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.5)",
  });
  const getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging ? "rgba(21, 245, 21, 0.342)" : "rgba(88, 206, 86, 0.05)",
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

  // console.log(playlists);

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

  // get tracklist of a playlist
  const getTracklist = (url, column) => {
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setPlaylists((prevLists) => {
          return prevLists.map((tracklist, i) => {
            if (i === column) return { ...tracklist, list: res.data.items };
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

  // handle drag&drop topbar
  const handleTopBarDrag = (result) => {
    console.log(result.destination);
    if (!result.destination) return;

    const items = reorder(
      playlistResult,
      result.source.index,
      result.destination.index
    );

    setPlaylistResult(items)
  };
  // handle drag&drop list-sections
  const handleOnDragEnd = (result) => {
    console.log(result.destination);
    if (!result.destination) return;
    const playlistPosition = result.destination.droppableId.slice(-1)
    const items = reorder(
      playlists[playlistPosition].list,
      result.source.index,
      result.destination.index
    )
    const newPlaylists = [...playlists]
    newPlaylists[playlistPosition].list = items
    setPlaylists(newPlaylists)
  };

  // render main /////////////////////////////////////
  return (
    <>
      <DragDropContext onDragEnd={handleTopBarDrag}>
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
                        className='playlist-item'
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
      </DragDropContext>
      <div className="tracklist-container">
        {playlists.map((playlist, index) => {
          return (
            <DragDropContext
              key={"section-" + index}
              onDragEnd={handleOnDragEnd}
            >
              <Droppable droppableId={"playlist-" + index}>
                {(provided, snapshot) => (
                  <ul
                    className={"tracklist playlist-" + index}
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
                                className='tracklist-item'
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
            </DragDropContext>
          );
        })}
      </div>
    </>
  );
}

export default Main;
