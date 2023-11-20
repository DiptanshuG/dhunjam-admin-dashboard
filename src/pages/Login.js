import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye,FaEyeSlash  } from "react-icons/fa";

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await fetch(
        "https://stg.dhunjam.in/account/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200 && data.response === "Success") {
        handleLogin(data.data);
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Error during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Venue Admin Login</h1>
      {error && <p className="login-error">{error}</p>}
      <div>
        <input
          className="login-input"
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="password-input">
        <input
          className="login-input"
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {showPassword ? (
          <FaEyeSlash
            onClick={() => setShowPassword(!showPassword)}
            className="eye-icon"
          />
        ) : (
          <FaEye
            onClick={() => setShowPassword(!showPassword)}
            className="eye-icon"

          />
        )}
      </div>
      <button className="login-button" onClick={handleSignIn}>
        Sign In
      </button>
      <p className="new-registration-text">New Registration ?</p>
    </div>
  );
};

export default Login;
