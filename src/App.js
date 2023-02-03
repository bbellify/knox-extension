/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { getStorage } from "./storage";

import { Home } from "./components/home";
import { Connect } from "./components/connect";
import { Secret } from "./components/secret";
import { sendMessage } from "./utils";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUrlApiAndSecret() {
      sendMessage({ type: "getState" });
      const { url } = await getStorage(["url"]);
      if (!url) {
        return navigate("/connect");
      } else {
        chrome.runtime.onMessage.addListener(function (message) {
          if (message.type === "state") {
            console.log("message in app", message);

            if (!message.state.api) return navigate("/connect");
            if (!message.state.secret) return navigate("/secret");
          }
        });
      }
    }
    checkUrlApiAndSecret();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path={"/"} exact={true} element={<Home />} />
        <Route path={"/connect"} exact={true} element={<Connect />} />
        <Route path={"/secret"} exact={true} element={<Secret />} />
      </Routes>
    </div>
  );
}

export default App;
