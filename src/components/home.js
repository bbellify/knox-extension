/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "../utils";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { getStorage } from "../storage";

export function Home() {
  const navigate = useNavigate();
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button onClick={() => navigate("/setup")}>test to setup</button>
      <button onClick={() => navigate("/secret")}>test to secret</button>
      <button onClick={() => sendMessage({ type: "scryVault" })}>
        <ArrowPathIcon className="refreshIcon" />
      </button>
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
          <p>welcome to knox, your web2 password vault</p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <button
              style={{ width: "65%" }}
              onClick={() => sendMessage({ type: "setUrl", url: "" })}
            >
              clear url
            </button>
            {/* TODO: getState button only for testing */}
            <button
              style={{ width: "65%" }}
              onClick={() => sendMessage({ type: "getState" })}
            >
              log state in bg
            </button>
            <button
              style={{ width: "65%" }}
              onClick={async () =>
                sendMessage({
                  type: "default",
                  message: await getStorage(["vault", "url", "shipCreds"]),
                })
              }
            >
              log storage - vault, url, shipCreds
            </button>
            <button
              style={{ width: "65%" }}
              onClick={() => {
                chrome.storage.local.remove("shipCreds");
                chrome.storage.local.remove("url");
                chrome.storage.local.remove("vault");
              }}
            >
              remove url shipCreds and vault from storage
            </button>
            <button
              style={{ width: "65%" }}
              onClick={() => sendMessage({ type: "openKnoxTab" })}
            >
              open Knox app
            </button>
          </div>
        </>
      )}
    </div>
  );
}
