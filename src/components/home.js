/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  generateIcon,
  lockIcon,
  expandIcon,
  refreshIcon,
  copyIcon,
  closeIcon,
} from "../icons";

export function Home() {
  const navigate = useNavigate();
  const [spin, setSpin] = useState(false);
  const [generateShake, setGenerateShake] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);
  const [lockShake, setLockShake] = useState(false);
  const [suggestion, setSuggestion] = useState(false);
  const [sugForm, setSugForm] = useState({
    website: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    // TODO: no else here, do I need a catch in case of runtime busted?
    chrome.runtime.sendMessage({ type: "getState" }, (res) => {
      const { suggestion } = res.state;

      if (!suggestion) {
        return;
      } else {
        setSuggestion(true);
        setSugForm({
          website: suggestion.website,
          username: suggestion.newUsername,
          password: suggestion.newPassword,
        });
      }
    });
  }, []);

  function handleInput(e) {
    const name = e.target.name;
    setSugForm({
      ...sugForm,
      [name]: e.target.value,
    });
  }

  function handleGenerate() {
    console.log("generate");
    setGenerateShake(true);
    setShowGenerated(true);
    // send message type:"generate"
    setTimeout(() => {
      setGenerateShake(false);
    }, 300);
  }

  function handleRefresh() {
    setSpin(true);
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: "scryVault" });
    setTimeout(() => {
      setSpin(false);
    }, 500);
  }

  function handleOpenKnox() {
    chrome.runtime.sendMessage({ type: "openKnoxTab" }, (res) => {
      if (res?.message === "noSecret") navigate("/secret");
    });
  }

  function handleLock() {
    setLockShake(true);
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: "lock" });
    setTimeout(() => {
      navigate("/secret");
    }, 300);
  }

  function handleCloseGenerated() {
    // don't forget to set generated pass state to ''
    setShowGenerated(false);
  }

  return (
    <div className="flex-col mt-4 mb-8">
      <p className="mb-3">knox, your web2 password vault</p>
      <div className="my-1 border-t border-black w-full"></div>

      <div className="flex hover:bg-blue-300">
        <button
          onClick={handleGenerate}
          className="w-full flex py-2"
          title="generate password"
        >
          <div className={`px-1 ${generateShake ? "shakeX" : null}`}>
            {generateIcon()}
          </div>
          <p className="">Generate password</p>
        </button>
      </div>

      <div className="flex hover:bg-blue-300">
        <button
          onClick={handleRefresh}
          className="w-full flex py-2"
          title="refresh"
        >
          <div className={`px-1 ${spin ? "refresh" : null}`}>
            {refreshIcon()}
          </div>
          <p style={{ transform: "translateY(1px)" }} className="">
            Refresh
          </p>
        </button>
      </div>

      <div className="flex hover:bg-blue-300">
        <button
          onClick={handleOpenKnox}
          className="w-full flex py-2"
          title="open knox"
        >
          <div className={"px-1"}>{expandIcon()}</div>
          <p className="">Expand view</p>
        </button>
      </div>

      <div className="flex hover:bg-blue-300">
        <button onClick={handleLock} className="w-full flex py-2" title="lock">
          <div className={`px-1 ${lockShake ? "lockShake" : null}`}>
            {lockIcon()}
          </div>
          <p className="">Lock</p>
        </button>
      </div>

      <div className="my-1 border-t border-black w-full"></div>

      {showGenerated && (
        <div className="flex justify-center">
          {/* TODO: need to set up state for generated password, however that gets made */}
          <button className="flex">
            generated123
            <div>{copyIcon()}</div>
          </button>
          <button onClick={handleCloseGenerated}>{closeIcon()}</button>
        </div>
      )}
      <>
        {/* reference - this is old 4 button design */}
        {/* <div className="flex p-2 justify-around">
          {/* TODO: wire up the generate password button
          {/* TODO: generated password saves to state, persists until cleared or suggestion set. render component underneath buttons with generated and clear button and copy button
          <button
            onClick={handleGenerate}
            className="border border-black rounded w-[50px] hover:scale-125 p-1 shadow "
            title="generate password"
          >
            <div className={`${generateShake ? "shakeX" : null}`}>
              {generateIcon()}
            </div>
          </button>

          <button
            onClick={handleRefresh}
            className="border border-black rounded w-[50px] hover:scale-125 p-1"
            title="get latest"
          >
            <div className={`${spin ? "refresh" : null}`}>{refreshIcon()}</div>
          </button>

          <button
            onClick={handleOpenKnox}
            className="border border-black rounded w-[50px] hover:scale-125 p-1"
            title="open app"
          >
            {expandIcon()}
          </button>

          <button
            onClick={handleLogOut}
            className="border border-black rounded w-[50px] hover:scale-125 p-1"
            title="log out"
          >
            <div className={`${logoutShake ? "logoutShake" : null}`}>
              {lockIcon()}
            </div>
          </button>
        </div> */}
        {/* <div>
            <p>testing buttons</p>
            {/* // TODO: getState button only for testing
            <button
              style={{ width: "65%" }}
              onClick={() => sendMessage({ type: "stateTest" })}
            >
              log state in bg
            </button>
            <button
              style={{ width: "65%" }}
              onClick={async () =>
                sendMessage({
                  type: "default",
                  message: await getStorage(["vault", "shipCreds"]),
                })
              }
            >
              log storage - vault, shipCreds
            </button>
            <button
              style={{ width: "65%" }}
              onClick={() => {
                chrome.storage.local.remove("shipCreds");
                chrome.storage.local.remove("vault");
              }}
            >
              remove url shipCreds and vault from storage
            </button>
            <button
              style={{ width: "65%" }}
              onClick={() => sendMessage({ type: "clearSecretTest" })}
            >
              clear secret
            </button>
          </div> */}
        {suggestion && (
          <>
            <p>save this entry?</p>
            <div style={{ width: "95%" }}>
              {/* TODO: this should be a form in case it needs to be edited */}
              <div>
                <label>website:</label>
                <input
                  name={"website"}
                  value={sugForm.website}
                  onChange={handleInput}
                ></input>
              </div>
              <div>
                <label>username:</label>
                <input
                  name={"username"}
                  value={sugForm.username}
                  onChange={handleInput}
                ></input>
              </div>
              <div>
                <label>password:</label>
                <input
                  name={"password"}
                  type={"password"}
                  onChange={handleInput}
                  value={sugForm.password}
                ></input>
              </div>
              {/* TODO: wire up this button */}
            </div>
            <button onClick={() => console.log("save suggestion entry")}>
              save
            </button>
            <button
              onClick={() => {
                sendMessage({
                  type: "setSuggestion",
                  suggestion: null,
                });
                setSuggestion(false);
              }}
            >
              clear
            </button>
          </>
        )}
      </>
    </div>
  );
}
