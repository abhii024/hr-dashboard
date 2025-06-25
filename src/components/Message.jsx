import React from "react";

const Message = ({ type = "success", text = "" }) => {
  if (!text) return null;

  const styles = {
    padding: "10px",
    marginTop: "10px",
    borderRadius: "5px",
    fontWeight: "bold",
    color: type === "success" ? "green" : "red",
    backgroundColor: type === "success" ? "#e6ffe6" : "#ffe6e6",
    border: `1px solid ${type === "success" ? "green" : "red"}`,
  };

  return <div style={styles}>{text}</div>;
};

export default Message;
