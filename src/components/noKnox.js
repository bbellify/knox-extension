/* eslint-disable no-undef */
import React from "react";
import { useNavigate } from "react-router-dom";

import { getStorage } from "../storage";

export function NoKnox() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/setup")}>test to setup</button>
      <button onClick={() => navigate("/secret")}>test to secret</button>

      <p>before continuing, download %knox on your ship</p>

      <button
        style={{ width: "65%" }}
        // eslint-disable-next-line no-undef
        onClick={() => chrome.runtime.sendMessage({ type: "openKnoxTab" })}
      >
        open Knox app
      </button>
    </>
  );
}
