import React from "react";

const Input = ({ type, id, placeholder, value, onChange }) => {
  return (
    <div>
      <input
        className="login-input"
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
