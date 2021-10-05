import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { IoAddCircleOutline } from "react-icons/io5";
import { FiMinimize2, FiSave } from "react-icons/fi";
import PlaylistItem from "../../components/PlaylistItem";
import TracklistItem from "../../components/TracklistItem";

// change style of elements while interaction

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver && "rgba(255, 255, 255, 0.1)",
});
const getItemStyle = (isDragging, draggableStyle) => ({
  borderRadius: ".5rem",
  background: isDragging && "rgba(21, 245, 21, 0.342)",
  // styles we need to apply on draggables
  ...draggableStyle,
});

function Main({ isValidSession, history }) {
  const params = localStorage.getItem("params");
  const token = JSON.parse(params).access_token;

  const [playlistResult, setPlaylistResult] = useState([]);
  const [playlists, setPlaylists] = useState([
    { lists: [], selected: 0 },
    { lists: [], selected: null },
  ]);
  const [dragItemOrigin, setDragItemOrigin] = useState("");

  console.log(playlists);

  if (!isValidSession()) history.push("/");

  // get users playlist at start of a session
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
  const getTracklist = async (playlistData) => {
    const tracklistUrl = playlistData.tracks.href;
    return axios
      .get(tracklistUrl, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => res.data.items)
      .catch((err) => console.log(err));
  };

  // reorder listItem in play- and tracklist
  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  // check if there is already a playlist in the section
  const includesPlaylist = (sectionList, selectedPlaylist) => {
    let isIncluded = false 
    sectionList.forEach((element) => {
      if (element.data.id === selectedPlaylist.id) isIncluded= true;
    });
    return isIncluded
  };

  // handle drag&drop
  const handleOnDragEnd = (result) => {
    console.log(result);
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (result.source.droppableId === "playlists-top") {
      // sort playlists inside top bar
      if (result.destination.droppableId === result.source.droppableId) {
        const items = reorder(playlistResult, sourceIndex, destinationIndex);
        setPlaylistResult(items);
      }
      // get tracklist from playlist and put it into section
      else {
        const playlistPosition = parseInt(
          result.destination.droppableId.slice(-1)
        );
        const selectedPlaylist = [...playlistResult].splice(sourceIndex, 1)[0];

        if (includesPlaylist(playlists[playlistPosition].lists, selectedPlaylist)) return

        getTracklist(selectedPlaylist).then((tracklist) => {
          setPlaylists((prevLists) => {
            return prevLists.map((section, i) => {
              if (i === playlistPosition) {
                return {
                  ...section,
                  lists: [
                    ...section.lists,
                    { tracklist: tracklist, data: selectedPlaylist },
                  ],
                };
              }
              return section;
            });
          });
        });
      }
    } else {
      const playlistPosition = result.destination.droppableId.split("-");
      const sectionIndex = playlistPosition[playlistPosition.length - 2];
      const playlistIndex = playlistPosition[playlistPosition.length - 1];
      // sort tracklist order if item is from same tracklist
      if (result.source.droppableId === result.destination.droppableId) {
        const newTracklist = reorder(
          playlists[sectionIndex].lists[playlistIndex].tracklist,
          result.source.index,
          result.destination.index
        );
        const newPlaylists = [...playlists];
        newPlaylists[sectionIndex].lists[playlistIndex].tracklist =
          newTracklist;
        // setPlaylists(newPlaylists);
      }
      if (result.destination.droppableId.includes("playlist-item-")) {
        const tracklistItemSource = result.source.droppableId.split("-");
        const trackSectionSource =
          tracklistItemSource[tracklistItemSource.length - 2];
        const trackPlaylistSource =
          tracklistItemSource[tracklistItemSource.length - 1];
        const newPlaylists = [...playlists];
        const newTrack =
          newPlaylists[trackSectionSource].lists[trackPlaylistSource].tracklist[
            sourceIndex
          ];
        newPlaylists[sectionIndex].lists[playlistIndex].tracklist.push(
          newTrack
        );
      }
    }
  };
  const handleOnDragStart = (result) => {
    setDragItemOrigin(result.source.droppableId);
  };

  const handleMinimize = (index) => {
    const newPlaylists = [...playlists];
    newPlaylists[index] = { ...newPlaylists[index], selected: null };
    setPlaylists(newPlaylists);
  };

  const handleMaximize = (index, item) => {
    const newPlaylists = [...playlists];
    newPlaylists[index] = { ...newPlaylists[index], selected: item };
    setPlaylists(newPlaylists);
  };

  // render main /////////////////////////////////////
  return (
    <>
      <DragDropContext
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
      >
        <Droppable
          droppableId="playlists-top"
          direction="horizontal"
          isDropDisabled={dragItemOrigin.includes("tracklist")}
        >
          {(provided, snapshot) => (
            <div
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
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        onClick={() => getTracklist(item.tracks.href, 0)}
                      >
                        <PlaylistItem image={item.images} title={item.name} />
                      </div>
                    )}
                  </Draggable>
                );
              })}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="working-space">
          {playlists.map((section, sectionIndex) => {
            return (
              <Droppable
                key={"playlist-container-" + sectionIndex}
                droppableId={"playlist-container-" + sectionIndex}
                isDropDisabled={dragItemOrigin.includes("tracklist")}
              >
                {(provided, snapshot) => (
                  <section
                    className="playlist-container"
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {section.lists.length > 0 ? (
                      // if the section isnt empty render playlists
                      section.selected !== null ? (
                        // if a playlist is selected render this playlist
                        <div className="tracklist">
                          <div className="tracklist-header">
                            <h4>{section.lists[section.selected].data.name}</h4>
                            <div>
                              <button
                                className="btn minimize"
                                onClick={() =>
                                  handleMinimize(playlists.indexOf(section))
                                }
                              >
                                <FiMinimize2 />
                              </button>
                              <button
                                className="btn save"
                                onClick={() => handleMinimize(section.selected)}
                              >
                                <FiSave />
                              </button>
                            </div>
                          </div>
                          <Droppable
                            key={"section-" + sectionIndex}
                            droppableId={`tracklist-${sectionIndex}-${section.selected}`}
                            isDropDisabled={dragItemOrigin === "playlists-top"}
                          >
                            {(provided, snapshot) => (
                              <ul
                                className={"tracklist-content"}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                              >
                                {section.lists[section.selected].tracklist.map(
                                  (item, trackIndex) => {
                                    const track = item.track;
                                    return (
                                      <Draggable
                                        key={track.id}
                                        draggableId={`tracklist-${sectionIndex}-${trackIndex}`}
                                        index={trackIndex}
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
                                  }
                                )}
                                {provided.placeholder}
                              </ul>
                            )}
                          </Droppable>
                        </div>
                      ) : (
                        // if no playlist is selected render all playlists
                        section.lists.map((item, itemIndex) => {
                          return (
                            <Droppable
                              key={`playlist-item-${sectionIndex}-${itemIndex}`}
                              droppableId={`playlist-item-${sectionIndex}-${itemIndex}`}
                              // change this later when preventing dropping playlists in tracklist
                              isDropDisabled={false}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className="playlist-drop-item"
                                  style={getListStyle(snapshot.isDraggingOver)}
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  onDoubleClick={() =>
                                    handleMaximize(sectionIndex, itemIndex)
                                  }
                                >
                                  <PlaylistItem
                                    image={item.data.images}
                                    title={item.data.name}
                                  />
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          );
                        })
                      )
                    ) : (
                      <div className="tracklist-placeholder">
                        <div>
                          Drop a Playlist <IoAddCircleOutline />
                        </div>
                      </div>
                    )}

                    {provided.placeholder}
                  </section>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
}

export default Main;
