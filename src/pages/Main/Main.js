import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";

import Topbar from "../../components/Topbar";
import Workspace from "../../components/Workspace";

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

  const [userId, setUserId] = useState("");
  const [playlistResult, setPlaylistResult] = useState([]);
  const [playlists, setPlaylists] = useState([
    { lists: [], selected: 0 },
    { lists: [], selected: null },
  ]);
  const [dragItemOrigin, setDragItemOrigin] = useState("");

  // console.log(playlists);

  if (!isValidSession()) history.push("/");

  // get users playlist at start of a session
  useEffect(() => {
    console.log("getting data from spotify api");
    axios
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => setPlaylistResult(res.data.items))
      .catch((err) => console.log(err));

    axios
      .get("https://api.spotify.com/v1/me/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => setUserId(res.data.id))
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

  const savePlaylist = (pl) => {
    console.log(pl.data);
    // create new playlist on spotify
    if (!pl.data.id) {
      axios
        .post(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          {
            name: pl.data.name,
            description: "created with sortify",
            public: false,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          const newPlaylistId = res.data.id;
          const tracksUris = pl.tracksAdded.join();
          console.log(tracksUris);
          axios({
            method: "post",
            url: `https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks?uris=${tracksUris}`,
            headers: {
              Authorization: "Bearer " + token,
            },
          });
        })
        .catch((err) => console.log(err));
    }
    console.log('only new created playlists yet');
  };
  // reorder listItem in play- and tracklist
  const reorder = (list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  // check if there is already a playlist in the section
  const includesPlaylist = (array, selectedPlaylist) => {
    let isIncluded = false;
    array.forEach((element) => {
      if (element.data.id === selectedPlaylist.id) isIncluded = true;
    });
    return isIncluded;
  };

  // handle drag&drop
  const handleOnDragEnd = (result) => {
    // console.log(result);
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (result.source.droppableId === "playlists-top") {
      // order playlists inside top bar
      if (result.destination.droppableId === result.source.droppableId) {
        setPlaylistResult((prevPlaylists) => {
          const items = reorder(prevPlaylists, sourceIndex, destinationIndex);
          return items;
        });
      }
      // get tracklist from playlist and put it into section
      else {
        const tracklistItemDest = parseInt(
          result.destination.droppableId.slice(-1)
        );
        const selectedPlaylist = [...playlistResult].splice(sourceIndex, 1)[0];

        if (
          includesPlaylist(playlists[tracklistItemDest].lists, selectedPlaylist)
        )
          return;

        getTracklist(selectedPlaylist).then((tracklist) => {
          setPlaylists((prevLists) => {
            return prevLists.map((section, i) => {
              if (i === tracklistItemDest) {
                return {
                  ...section,
                  lists: [
                    ...section.lists,
                    {
                      tracklist: tracklist,
                      data: selectedPlaylist,
                      tracksAdded: [],
                    },
                  ],
                };
              }
              return section;
            });
          });
        });
      }
    }

    if (result.source.droppableId.includes("tracklist")) {
      const tracklistItemDest = result.destination.droppableId.split("-");
      const tracklistSectionDest = parseInt(
        tracklistItemDest[tracklistItemDest.length - 2]
      );
      const tracklistPlaylistDest = parseInt(
        tracklistItemDest[tracklistItemDest.length - 1]
      );

      // sort tracklist order if item is from same tracklist
      if (result.source.droppableId === result.destination.droppableId) {
        setPlaylists((prevPlaylists) => {
          return prevPlaylists.map((section, i) => {
            if (i === tracklistSectionDest) {
              return {
                ...section,
                lists: section.lists.map((list, i) => {
                  if (i === tracklistPlaylistDest) {
                    return {
                      ...list,
                      tracklist: reorder(
                        list.tracklist,
                        sourceIndex,
                        destinationIndex
                      ),
                    };
                  }
                  return list;
                }),
              };
            }
            return section;
          });
          // const newPlaylists = [...prevPlaylists];
          // const newTracklist = reorder(
          //   prevPlaylists[tracklistSectionDest].lists[tracklistPlaylistDest].tracklist,
          //   result.source.index,
          //   result.destination.index
          // );
          // newPlaylists[tracklistSectionDest].lists[tracklistPlaylistDest].tracklist =
          //   newTracklist;
          // return newPlaylists
        });
      }
      if (result.destination.droppableId.includes("playlist-item-")) {
        const tracklistItemSource = result.source.droppableId.split("-");
        const trackSectionSource = parseInt(
          tracklistItemSource[tracklistItemSource.length - 2]
        );

        const trackPlaylistSource = parseInt(
          tracklistItemSource[tracklistItemSource.length - 1]
        );
        setPlaylists((prevPlaylists) => {
          const newTrack =
            prevPlaylists[trackSectionSource].lists[trackPlaylistSource]
              .tracklist[sourceIndex];

          return prevPlaylists.map((section, i) => {
            if (i === tracklistSectionDest) {
              return {
                ...section,
                lists: section.lists.map((list, i) => {
                  if (i === tracklistPlaylistDest) {
                    // check if track is already in playlist
                    let isIncluded = false;
                    list.tracklist.forEach((trackObj) => {
                      if (trackObj.track.id === newTrack.track.id)
                        isIncluded = true;
                    });

                    if (isIncluded) {
                      return list;
                    } else {
                      return {
                        ...list,
                        tracklist: [...list.tracklist, newTrack],
                        tracksAdded: [...list.tracksAdded, newTrack.track.uri],
                      };
                    }
                  }
                  return list;
                }),
              };
            }
            return section;
          });
        });
      }
    }
  };
  const handleOnDragStart = (result) => {
    setDragItemOrigin(result.source.droppableId);
  };

  // render main /////////////////////////////////////
  return (
    <>
      <DragDropContext
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
      >
        <Topbar
          playlistData={playlistResult}
          dragItemOrigin={dragItemOrigin}
          getListStyle={getListStyle}
          getItemStyle={getItemStyle}
        />
        <Workspace
          playlists={playlists}
          setPlaylists={setPlaylists}
          dragItemOrigin={dragItemOrigin}
          getListStyle={getListStyle}
          getItemStyle={getItemStyle}
          savePlaylist={savePlaylist}
        />
      </DragDropContext>
    </>
  );
}

export default Main;
