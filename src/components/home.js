/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "../utils";

import { generateIcon, lockIcon, expandIcon, refreshIcon } from "../icons";

import { getStorage } from "../storage";

export function Home() {
  const navigate = useNavigate();
  const [spin, setSpin] = useState(false);
  const [generateShake, setGenerateShake] = useState(false);
  const [logoutShake, setLogoutShake] = useState(false);
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
    // send message type:"generate"
    setTimeout(() => {
      setGenerateShake(false);
    }, 300);
  }

  function handleRefresh() {
    setSpin(true);
    sendMessage({ type: "scryVault" });
    setTimeout(() => {
      setSpin(false);
    }, 1000);
  }

  function handleOpenKnox() {
    chrome.runtime.sendMessage({ type: "openKnoxTab" }, (res) => {
      if (res?.message === "noSecret") navigate("/secret");
    });
  }

  function handleLogOut() {
    setLogoutShake(true);
    sendMessage({ type: "logout" });
    setTimeout(() => {
      navigate("/secret");
    }, 300);
  }

  return (
    <div className="flex-col">
      <p>knox, your web2 password vault</p>
      {suggestion ? (
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
      ) : (
        <>
          <div className="flex p-2 justify-around">
            {/* TODO: wire up the generate password button */}
            {/* TODO: generated password saves to state, persists until cleared or suggestion set. render component underneath buttons with generated and clear button and copy button */}
            <button
              onClick={handleGenerate}
              className="border border-black rounded w-[50px] hover:scale-125 p-1"
              title="generate password"
            >
              <div className={`${generateShake ? "generateShake" : null}`}>
                {generateIcon()}
              </div>
            </button>

            <button
              onClick={handleRefresh}
              className="border border-black rounded w-[50px] hover:scale-125 p-1"
              title="get latest"
            >
              <div className={`${spin ? "motion-safe:animate-spin" : null}`}>
                {refreshIcon()}
              </div>
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
          </div>
          <div>
            <p>testing buttons</p>
            {/* // TODO: getState button only for testing */}
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
          </div>
        </>
      )}
    </div>
  );
}
