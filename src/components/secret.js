/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { aesDecrypt, sendMessage } from "../utils";
import { getStorage } from "../storage";

export function Secret() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState("");
  const [shipCreds, setShipCreds] = useState(null);
  const [secretError, setSecretError] = useState(null);

  useEffect(() => {
    async function getShipCreds() {
      const { shipCreds } = await getStorage("shipCreds");
      // TODO: handle if no shipCreds
      setShipCreds(shipCreds);
      console.log("shipCreds", shipCreds);
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
      });
      return navigate("/");
    } else {
      return setSecretError("invalid secret");
    }
  }

  return (
    <>
      <div className="flex flex-col mt-3 h-[120px] items-center">
        <p>Log in to Knox:</p>
        <input
          name="secret"
          value={secret}
          onChange={handleInput}
          className="border border-black w-3/5 mt-2 mb-1 px-3 py-1"
        />
        <button
          className="border border-black px-2 py-1"
          onClick={validateSecret}
        >
          log in
        </button>
        {secretError && (
          <p className="text-red-500 font-bold mt-2">{secretError}</p>
        )}
      </div>
    </>
  );
}
