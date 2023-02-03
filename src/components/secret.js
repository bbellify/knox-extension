/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { sendMessage } from "../utils";

export function Secret() {
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.type === "secret") {
      if (message.secret) return navigate("/");
      // TODO: handle if no secret?
    }
  });

  const navigate = useNavigate();
  const [secret, setSecret] = useState("");

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
