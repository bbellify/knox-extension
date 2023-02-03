/* eslint-disable no-undef */
import React from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "../utils";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/connect")}>test to connect</button>
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
        {/* TODO: testScry button only for testing, can remove later */}
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "testScry" })}
        >
          test scry
        </button>
        {/* TODO: getState button only for testing */}
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "getState" })}
        >
          log state in bg
        </button>
      </div>
    </>
  );
}
