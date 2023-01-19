import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Urbit from "@urbit/http-api";
import { useStore } from "../store";

let sse;

// = new EventSource("http://localhost:80/~/login");
// console.log("sse", sse);
// sse.onmessage = (message) => {
//   console.log("message", message);
// };

// window.api
//   .scry({
//     app: "knox",
//     path: "/vault",
//   })
//   .then((res) => console.log("scry res", res));

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [login, setLogin] = useState({
    ship: "~",
    url: "",
    code: "",
  });

  const state = useStore.getState();

  function sendMessage(message) {
    //eslint-disable-next-line
    chrome.runtime.sendMessage(message);
  }

  function prepShipName(ship) {
    return ship.split("")[0] === "~" ? ship.split("").slice(1).join("") : ship;
  }

  function handleInput(e) {
    const name = e.target.name;
    setLogin({
      ...login,
      [name]: e.target.value,
    });
  }

  async function connect() {
    await Urbit.authenticate({
      //   ship: prepShipName(login.ship).trim(),
      //   url: login.url.trim(),
      //   code: login.code.trim(),
      // lathus-worsem-bortem-padmel
      ship: "bud",
      url: "localhost:80",
      code: "lathus-worsem-bortem-padmel",
      verbose: true,
    })
      .then((res) => {
        window.api = res;
      })
      .catch(() => setError(true));
  }

  function testScry() {
    window.api
      .scry({
        app: "knox",
        path: "/vault",
      })
      .then((res) => console.log("scry res", res));
  }

  return (
    <>
      <p>shippy</p>
      <input name="ship" value={login.ship} onChange={handleInput} />
      <p>password</p>
      <input name="code" value={login.code} onChange={handleInput} />

      <p>url where you connect to your ship</p>
      <input name="url" value={login.url} onChange={handleInput} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <button style={{ width: "65%" }} onClick={connect}>
          log in
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() =>
            sendMessage({
              type: "store",
              item: { key: Math.random() },
            })
          }
        >
          test set storage
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "getStore", key: "key" })}
        >
          test get storage
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "logUrl" })}
        >
          test get state
        </button>
        <button style={{ width: "65%" }} onClick={() => sendMessage("auth")}>
          message
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "auth", url: "localhost:80" })}
        >
          auth
        </button>
        <button
          style={{ width: "65%" }}
          onClick={() => sendMessage({ type: "setUrl", url: login.url })}
        >
          test set url
        </button>
        <button style={{ width: "65%" }} onClick={testScry}>
          test scry
        </button>
      </div>
      {error && <p style={{ color: "red" }}>something went wrong</p>}
    </>
  );
}
