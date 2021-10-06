import React from "react";

function PlaylistItem({ image, title, tracksAdded }) {
  const smallestImage = image.reduce((smallest,img)=>{
    if (img.height < smallest.height) return img
    return smallest
  })
  return (
    <div className='playlist-item'>
      <img className='playlist-cover' src={smallestImage.url} alt="cover" />
      <div className='playlist-title'>{title}</div>
      {tracksAdded>0&&<div className='tracks-added'>{tracksAdded}</div>}
    </div>
    
  );
}

export default PlaylistItem;
