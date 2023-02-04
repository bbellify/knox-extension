/* eslint-disable no-undef */
import React from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "../utils";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { getStorage } from "../storage";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/connect")}>test to connect</button>
      <button onClick={() => sendMessage({ type: "scryVault" })}>
        <ArrowPathIcon className="refreshIcon" />
      </button>
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
        {/* TODO: setApi is for testing, can remove later */}
        <button
          style={{ width: "65%" }}
          onClick={() =>
            sendMessage({ type: "setApi", url: "", ship: "", code: "" })
          }
        >
          clear api
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
              message: await getStorage(["vault", "secret", "url"]),
            })
          }
        >
          log storage - vault, secret, url
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => chrome.storage.local.remove("secret")}
        >
          remove secret from storage
        </button>
      </div>
    </>
  );
}
