import React from "react";

function TracklistItem({ image, title, artists }) {
  const smallestImage = image.reduce((smallest,img)=>{
    if (img.height < smallest.height) return img
    return smallest
  })
  return (
    <div className='tracklist-item'>
      <img className='tracklist-cover' src={smallestImage.url} alt="cover" />
      <div className='tracklist-title'>{title} <span>{artists[0].name}</span></div>
      
    </div>
    
  );
}

export default TracklistItem;
