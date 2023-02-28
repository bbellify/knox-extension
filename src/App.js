import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { getStorage } from "./storage";

import { Home } from "./components/home";
import { Setup } from "./components/setup";
import { Secret } from "./components/secret";
import { NoKnox } from "./components/noKnox";

function App() {
  const navigate = useNavigate();
  // TODO: might want to refactor this setup logic, the navSet is kinda broke
  const [navSet, setNavSet] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: "getState" }, async (res) => {
      const { api, secret } = res.state;
      const { shipCreds } = await getStorage("shipCreds");
      setNavSet(true);

      if (!shipCreds?.url || !shipCreds?.ship || !shipCreds?.code) {
        return navigate("/setup");
      }
      if (!api || !secret) {
        return navigate("/secret");
      }
      // return navigate("/");
    });
  }, []);

  return (
    <div className="App">
      {!navSet ? (
        <>
          {/* TODO: spinner here? */}
          <p>~</p>
          <button onClick={() => setNavSet(true)}>test to setNav</button>
        </>
      ) : (
        <Routes>
          <Route path={"/"} exact={true} element={<Home />} />
          <Route path={"/setup"} exact={true} element={<Setup />} />
          <Route path={"/secret"} exact={true} element={<Secret />} />
          <Route path={"/noKnox"} exact={true} element={<NoKnox />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
