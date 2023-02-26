import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { getStorage } from "./storage";

import { Home } from "./components/home";
import { Setup } from "./components/setup";
import { Secret } from "./components/secret";
import { SecretSetup } from "./components/secretSetup";
import { NoKnox } from "./components/noKnox";

function App() {
  const navigate = useNavigate();
  // TODO: might want to refactor this setup logic, the navSet is kinda broke
  const [navSet, setNavSet] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: "getState" }, async (res) => {
      console.log("res in app", res);
      const { api, secret } = res.state;
      console.log("api and secret in app", api, secret);
      const { url, shipCreds } = await getStorage(["url", "shipCreds"]);
      console.log("url ship in response", url, shipCreds);
      setNavSet(true);

      // TODO: set up separate secret components, one for set up (no shipCreds) one for not (have shipCreds)?
      if (!url) {
        return navigate("/setup");
      }
      if (!shipCreds) {
        return navigate("/secretSetup");
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
          <Route path={"/secretSetup"} exact={true} element={<SecretSetup />} />
          <Route path={"/secret"} exact={true} element={<Secret />} />
          <Route path={"/noKnox"} exact={true} element={<NoKnox />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
