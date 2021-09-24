import React, {useEffect} from "react";
import { FaSpotify } from "react-icons/fa";

const Login = ({isValidSession, history}) => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const authUrl = process.env.REACT_APP_AUTHORIZE_URL;
  const redirectUrl = process.env.REACT_APP_REDIRECT_URL;

  useEffect(() => {
   if (isValidSession()) history.push('/main')

  })

  const handleLogin = () => {
    window.location = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=token&show_dialog=true&scope=user-library-read+user-top-read+playlist-modify-private+playlist-modify-public`;
  };

  return (
    <div className="intro-container">
      <div className="intro-box">
        <div className="login-box">
          <p className="login-style">Login with your</p>
          <button
            className="intro-btn"
            variant="info"
            type="submit"
            onClick={handleLogin}
          >
            <div className="intro-firstlink">
              {" "}
              <FaSpotify /> Spotify
            </div>
            <div className="intro-secondlink">
              {" "}
              <FaSpotify /> Spotify
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
