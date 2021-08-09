import React from "react";

function ListItem({ image, title, artist }) {
  const smallestImage = image.reduce((smallest,img)=>{
    if (img.height < smallest.height) return img
    return smallest
  })
  return (
    <div className='playlist-item'>
      <img src={smallestImage.url} alt="cover" width='80'/>
      <div>{title}</div>
      {artist && <div>{artist}</div>}
    </div>
    
  );
}

export default ListItem;
