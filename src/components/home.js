/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
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
          onClick={() =>
            sendMessage({
              type: "setStore",
              item: { key: Math.random() },
            })
          }
        >
          test set storage
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() =>
            sendMessage({
              type: "getStore",
              key: ["key", "auth", "vault", "url"],
            })
          }
        >
          test get storage
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "setUrl", url: "" })}
        >
          clear url
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() =>
            sendMessage({ type: "setApi", url: "", ship: "", code: "" })
          }
        >
          clear api
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "testScry" })}
        >
          test scry
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "getState" })}
        >
          get state
        </button>
      </div>
    </>
  );
}
