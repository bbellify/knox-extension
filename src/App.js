import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { sendMessage } from "./utils";

import { Home } from "./components/home";
import { Connect } from "./components/connect";
import { Secret } from "./components/secret";

function App() {
  const navigate = useNavigate();
  const [navSet, setNavSet] = useState(false);

  useEffect(() => {
    async function getPopupNav() {
      sendMessage({ type: "getNav" });
      // eslint-disable-next-line no-undef
      chrome.runtime.onMessage.addListener(function (message) {
        if (message.type === "popupNav") {
          setNavSet(true);
          return navigate(message.message);
        }
      });
    }
    getPopupNav();
  }, []);

  return (
    <div className="App">
      {!navSet ? (
        <p>~</p>
      ) : (
        <Routes>
          <Route path={"/"} exact={true} element={<Home />} />
          <Route path={"/connect"} exact={true} element={<Connect />} />
          <Route path={"/secret"} exact={true} element={<Secret />} />
          <Route path={"/save"} exact={true} element={<p>save</p>} />
        </Routes>
      )}
    </div>
  );
}

export default App;
