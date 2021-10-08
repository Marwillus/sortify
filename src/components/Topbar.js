import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import PlaylistItem from "./PlaylistItem";

function Topbar({ playlistData, dragItemOrigin, getListStyle, getItemStyle }) {
  return (
    <>
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
            {playlistData.map((item, index) => {
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
                      className='playlist-item'
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
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
    </>
  );
}

export default Topbar;
