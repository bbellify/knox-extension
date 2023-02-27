/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage } from "../storage";

import { sendMessage } from "../utils";

export function Setup() {
  const navigate = useNavigate();
  const [urlSet, setUrlSet] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [shipError, setShipError] = useState("");
  const [urlForm, setUrlForm] = useState("http://localhost:80");
  const [shipForm, setShipForm] = useState({
    ship: "",
    code: "",
    // ship: "~bud",
    // code: "lathus-worsem-bortem-padmel",
  });

  useEffect(() => {
    getStorage(["url", "shipCreds"]).then((res) => {
      // finish this with shipcreds logic
      // if url but no shipCreds, what?
      console.log("shipCreds", res.shipCreds);
      return res.url ? setUrlSet(true) : setUrlSet(false);
    });
  }, []);

  useEffect(() => {
    // TODO: change this to checking storage for URL and ship creds
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.type === "setupStatus") {
        if (message.error) {
          if (message.error === "url") {
            setUrlError(message.status);
            setUrlSet(false);
            return;
          }
          if (message.error === "ship") {
            setUrlError("");
            setShipError(message.status);
            return;
          }
        } else {
          if (message.status === "noKnox") {
            return navigate("/noKnox");
          } else if (message.status === "ok") {
            setUrlError("");
            setShipError("");
            return navigate("/secretSetup");
          }
        }
      }
    });
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

  async function handleConnectShip() {
    // move url to connect to ship method in state?
    // checking for url on mount, so maybe I don't need here
    const { url } = await getStorage(["url"]);
    sendMessage({
      type: "connectShipSetup",
      url: url,
      ship: prepShipName(shipForm.ship).trim(),
      code: shipForm.code.trim(),
    });
  }

  function handleSubmitUrl() {
    if (!urlForm.length) return setUrlError("enter a url");
    chrome.runtime.sendMessage({ type: "setUrl", url: urlForm }, (res) => {
      if (res.status === "urlSet") {
        setUrlError("");
        return setUrlSet(true);
      }
    });
  }

  return (
    <div className="flex-col mt-3">
      <p className="font-bold my-2">
        Welcome to Knox, your web2 password vault.
      </p>
      {!urlSet ? (
        <div className="flex flex-col mt-3 items-center">
          <p className="mb-2">Enter the url where you connect to your ship:</p>
          <input
            className="border border-black w-1/2 mb-2 px-3 py-1"
            name="url"
            value={urlForm}
            onChange={handleUrlForm}
          />
          <button
            className="border border-black px-2 py-1"
            onClick={handleSubmitUrl}
          >
            set url
          </button>
          {urlError && (
            <p className="text-red-500 font-bold mt-2">{urlError}</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col mt-3 items-center">
          <p className="mb-2">Enter your ship and code:</p>
          <input
            name="ship"
            placeholder="ship"
            value={shipForm.ship}
            className="border border-black w-3/5 mb-1 px-3 py-1"
            onChange={handleShipForm}
          />
          <input
            name="code"
            className="border border-black w-3/5 mb-2 px-3 py-1"
            value={shipForm.code}
            onChange={handleShipForm}
            placeholder="code"
            type="password"
          />
          <button
            onClick={handleConnectShip}
            className="border border-black px-2 py-1"
          >
            connect
          </button>
          {shipError && (
            <p className="text-red-500 font-bold mt-2">{shipError}</p>
          )}
        </div>
      )}
    </div>
  );
}
