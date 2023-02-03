/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log("message in indexjs", message);
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
