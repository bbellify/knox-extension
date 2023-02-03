/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { sendMessage } from "../utils";

export function Secret() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState("");

  useEffect(() => {
    sendMessage({ type: "getSecret" });
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.type === "getSecretRes") {
        return message.secret ? navigate("/") : null;
      }
    });
  }, []);

  chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === "secretSet") {
      return navigate("/");
      // TODO: handle if no secret?
    }
  });

  function handleInput(e) {
    setSecret(e.target.value);
  }

  return (
    <>
      <button onClick={() => navigate("/")}>test home</button>
      <p>set your secret</p>
      <input name="secret" value={secret} onChange={handleInput} />
      <button
        style={{ width: "65%" }}
        onClick={() => sendMessage({ type: "setSecret", secret: secret })}
      >
        set secret
      </button>
    </>
  );
}
