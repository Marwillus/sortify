import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


import Login from "./Login/Login";
import Redirect from "../components/Redirect";
import NotFound from "./NotFound/NotFound";
import Main from "./Main/Main";


function App() {
  const [expiryTime, setExpiryTime] = useState("0");

  useEffect(() => {
    let expiryTime;
    try {
      expiryTime = JSON.parse(localStorage.getItem("expiry_time"));
    } catch (error) {
      expiryTime = "0";
    }
    setExpiryTime(expiryTime);
  }, []);

  const isValidSession = () => {
    const currentTime = new Date().getTime();
    const expiryTimer = expiryTime;
    const isSessionValid = currentTime < expiryTimer;

    return isSessionValid;
  };
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route
            path="/redirect"
            render={(props) => (
              <Redirect
                isValidSession={isValidSession}
                setExpiryTime={setExpiryTime}
                {...props}
              />
            )}
          />
          <Route
            path="/main"
            render={(props) => (
              <Main isValidSession={isValidSession} {...props} />
            )}
          />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
