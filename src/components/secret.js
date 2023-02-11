/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { aesDecrypt, sendMessage } from "../utils";
import { getStorage } from "../storage";

export function Secret() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState("");
  const [shipCreds, setShipCreds] = useState(null);
  const [url, setUrl] = useState("");
  const [secretError, setSecretError] = useState(null);

  useEffect(() => {
    async function getShipCreds() {
      const { shipCreds, url } = await getStorage(["shipCreds", "url"]);
      // TODO: handle if no shipCreds
      setShipCreds(shipCreds);
      setUrl(url);
    }

    getShipCreds();
  }, []);

  function handleInput(e) {
    setSecret(e.target.value);
  }

  function validateSecret() {
    if (!secret) return setSecretError("enter your secret");
    if (
      aesDecrypt(shipCreds.ship, secret) &&
      aesDecrypt(shipCreds.code, secret)
    ) {
      setSecretError("");
      sendMessage({
        type: "setSecret",
        secret: secret,
        url: url,
        shipCreds: {
          ship: aesDecrypt(shipCreds.ship, secret),
          code: aesDecrypt(shipCreds.code, secret),
        },
      });
      return navigate("/");
    } else {
      return setSecretError("invalid secret");
    }
  }

  return (
    <>
      <h2>secret</h2>
      <button onClick={() => navigate("/")}>test home</button>
      <p>set your secret</p>
      <input name="secret" value={secret} onChange={handleInput} />
      {/* TODO: add a check here to validate they're the same, enter twice */}
      <button
        style={{ width: "65%" }}
        onClick={() => {
          validateSecret();
        }}
      >
        set secret
      </button>
      {secretError && <p>{secretError}</p>}
    </>
  );
}
