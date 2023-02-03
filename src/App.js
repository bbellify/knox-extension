/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { getStorage } from "./storage";

import { Login } from "./components/login";
import { Setup } from "./components/setup";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    getStorage(["auth", "url"]).then((res) => {
      console.log("res in app", res);
      if (!res.url) navigate("/setup");
    });
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path={"/"} exact={true} element={<Login />} />
        <Route path={"/setup"} exact={true} element={<Setup />} />
        <Route path={"/secret"} exact={true} element={<p>test secret</p>} />
      </Routes>
    </div>
  );
}

export default App;
