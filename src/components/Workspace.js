import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

import { IoAddCircleOutline } from "react-icons/io5";
import { FiMinimize2, FiSave } from "react-icons/fi";
import PlaylistItem from "./PlaylistItem";
import TracklistItem from "./TracklistItem";

function Workspace({
  playlists,
  setPlaylists,
  dragItemOrigin,
  getListStyle,
  getItemStyle,
}) {
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

  return (
    <div className="work-space">
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
                {section.selected === null && (
                  <div className="btn create-pl">
                    <IoAddCircleOutline />
                  </div>
                )}
                {section.lists.length > 0 ? (
                  // if the section is not empty render playlists
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
                                tracksAdded={item.tracksAdded}
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
  );
}

export default Workspace;
