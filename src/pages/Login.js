import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import Input from "../components/common/Input";
import PasswordToggle from "../components/common/PasswordToggle";
import "../assets/styles/login/Login.css";
import { ToastContainer, toast } from "react-toastify";

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "username") {
      setUsername(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const handleSignIn = async () => {
    // Check for empty fields
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    setLoading(true);

    try {
      const { status, data } = await loginUser(username, password);

      if (status === 200 && data.response === "Success") {
        localStorage.setItem("token", data.data.token);

        const decodedToken = parseJwt(data.data.token);
        handleLogin({
          id: decodedToken.user_id,
          username: decodedToken.username,
        });

        navigate("/dashboard");
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Error during sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <h1 className="login-heading">Venue Admin Login</h1>
      <Input
        type="text"
        id="username"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          handleInputChange(e);
        }}
      />

      <div className="password-input">
        <PasswordToggle
          showPassword={showPassword}
          togglePassword={togglePassword}
        />

        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            handleInputChange(e);
          }}
        />
      </div>

      <button
        className="login-button"
        onClick={handleSignIn}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
      <p className="new-registration-text">New Registration ?</p>
    </div>
  );
};

export default Login;
