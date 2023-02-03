/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage } from "../storage";

import { sendMessage } from "../utils";

export function Setup() {
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === "urlStorage") {
      if (!message.message.newValue) return setUrlSet(false);
      if (message.message.newValue) return setUrlSet(true);
    }
    if (message.type === "setupStatus") {
      console.log("setup status in setup", message);
      if (message.error) {
        if (message.error === "url") {
          setUrlError(message.status);
          setUrlSet(false);
        }
        if (message.error === "ship") {
          setUrlError("");
          setShipError(message.status);
        }
      }
      if (message.status === "ok") {
        setUrlError("");
        setShipError("");
        navigate("/");
      }
    }
  });

  useEffect(() => {
    getStorage(["url"]).then((res) => {
      !res.url ? setUrlSet(false) : setUrlSet(true);
    });
  }, []);

  const navigate = useNavigate();
  const [urlSet, setUrlSet] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [shipError, setShipError] = useState("");
  const [urlForm, setUrlForm] = useState("");
  const [shipForm, setShipForm] = useState({
    ship: "~",
    code: "lathus-worsem-bortem-padmel",
  });

  function prepShipName(ship) {
    return ship.split("")[0] === "~" ? ship.split("").slice(1).join("") : ship;
  }

  function handleUrlForm(e) {
    setUrlForm(e.target.value);
  }

  function handleShipForm(e) {
    const name = e.target.name;
    setShipForm({
      ...shipForm,
      [name]: e.target.value,
    });
  }

  async function handleConnect() {
    const { url } = await getStorage(["url"]);
    sendMessage({
      type: "connectShip",
      url: url,
      ship: prepShipName(shipForm.ship).trim(),
      code: shipForm.code.trim(),
    });
  }

  return !urlSet ? (
    <>
      <button onClick={() => navigate("/")}>test home</button>
      <p>url where you connect to your ship</p>
      <input name="url" value={urlForm} onChange={handleUrlForm} />
      <button
        style={{ width: "65%" }}
        onClick={() => sendMessage({ type: "setUrl", url: urlForm })}
      >
        test set url
      </button>
      {urlError && <p>{urlError}</p>}
    </>
  ) : (
    <>
      <button onClick={() => navigate("/")}>test home</button>
      <p>enter your ship and code</p>
      <input name="ship" value={shipForm.ship} onChange={handleShipForm} />
      <input
        name="code"
        value={shipForm.code}
        onChange={handleShipForm}
        placeholder={"code"}
      />
      <button onClick={handleConnect}>connect</button>
      {shipError && <p>{shipError}</p>}
    </>
  );
}
