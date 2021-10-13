import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const path = window.location.pathname.slice(1);

  return (
    <div className="notfound-container">
      {path === "403" ? (
        <>
          <h1>{path}</h1>
          <h2>Sorry, there is a problem</h2>
          <h4>
            This project is still in dev-mode. If you want to help me test it,
            please leave me a short message with your Spotify name and -email
          </h4>
          <button className='notfound-btn'>
          <a className=' notfound-link' href="mailto:marcusxwill@gmail.com">email me</a>
          </button>
        </>
      ) : (
        <>
        <h1>404</h1>
        <h2>Page not found</h2>
        </>

      )}

      <button className="notfound-btn">
        <Link to="/" className="notfound-link">
          {" "}
          Back to Home
        </Link>
        <Link to="/"> Back to Home</Link>
      </button>
    </div>
  );
};
export default NotFound;
