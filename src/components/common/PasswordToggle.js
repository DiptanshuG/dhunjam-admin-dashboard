// src/components/common/PasswordToggle.js

import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordToggle = ({ showPassword, togglePassword }) => {
  return (
    <div className="password-toggle" onClick={togglePassword}>
      {showPassword ? <FaEyeSlash className="eye-icon" /> : <FaEye className="eye-icon" />}
    </div>
  );
};

export default PasswordToggle;
