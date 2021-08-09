import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <h2>Page not found.</h2>
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
