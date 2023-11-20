import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = (data) => {
    setLoggedIn(true);
    setUserData(data);
  };

  useEffect(() => {
    // Check if a token exists in localStorage
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedToken = parseJwt(storedToken);

      handleLogin({
        id: decodedToken.user_id,
        username: decodedToken.username,
      });
    }
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login handleLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            loggedIn ? (
              <Dashboard userData={userData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
