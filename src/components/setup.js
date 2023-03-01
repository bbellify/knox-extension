/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import * as bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

import { aesEncrypt, sendMessage } from "../utils";
import { newApi } from "../urbit";
import { navPrev, navNext } from "../icons";

export function Setup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [urlError, setUrlError] = useState("");
  const [shipError, setShipError] = useState("");
  const [urlForm, setUrlForm] = useState("http://localhost:80");
  // const [urlForm, setUrlForm] = useState("");
  const [shipForm, setShipForm] = useState({
    // ship: "",
    // code: "",
    ship: "~bud",
    code: "lathus-worsem-bortem-padmel",
  });
  const [secretForm, setSecretForm] = useState("test");
  const [secretError, setSecretError] = useState("");
  const [api, setApi] = useState(null);

  useEffect(() => {
    // TODO: change this to checking storage for URL and ship creds
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.type === "setupStatus") {
        if (message.error) {
          if (message.error === "url") {
            setUrlError(message.status);
            return;
          }
          if (message.error === "code") {
            setUrlError("");
            setShipError(message.status);
            return;
          }
        } else {
          if (message.status === "noKnox") {
            return navigate("/noKnox");
          } else if (message.status === "connected") {
            setApi(newApi(urlForm, shipForm.ship, shipForm.code));
            setUrlError("");
            setShipError("");
            setStep(2);
            return;
          }
        }
      }
    });
  });

  function prepShipName(ship) {
    return ship.split("")[0] === "~" ? ship.split("").slice(1).join("") : ship;
  }

  function handleUrlForm(e) {
    setUrlForm(e.target.value);
  }

  function handleShipForm(e) {
    const name = e.target.name;
    setShipForm({
      ...shipForm,
      [name]: e.target.value,
    });
  }

  function handleSecretForm(e) {
    setSecretForm(e.target.value);
  }

  function handleConnectShip() {
    // TODO: handle the !urlForm errror
    if (!urlForm) return;
    sendMessage({
      type: "connectShipSetup",
      url: urlForm,
      ship: prepShipName(shipForm.ship).trim(),
      code: shipForm.code.trim(),
    });
  }

  function handleValidate() {
    // if !secret set secret error
    if (!secretForm) return setSecretError("enter your secret");
    api
      .scry({
        app: "knox",
        path: "/secret",
      })
      .then((res) => {
        if (res.secret) {
          if (bcrypt.compareSync(secretForm, res.secret)) {
            sendMessage({
              type: "saveCreds",
              secret: secretForm,
              shipCreds: {
                url: aesEncrypt(urlForm, secretForm),
                ship: aesEncrypt(shipForm.ship, secretForm),
                code: aesEncrypt(shipForm.code, secretForm),
              },
            });
            return navigate("/");
          } else {
            // wrong secret
            setSecretError("invalid secret");
          }
        }
      });
  }

  function handleNext() {
    switch (step) {
      case 1: {
        handleConnectShip();
        setShipError("");
        setUrlError("");
        setSecretError("");
        break;
      }
      case 2: {
        handleValidate();
        break;
      }
      default:
        return;
    }
  }

  function handlePrevious() {
    if (step > 1) setStep(step - 1);
  }

  function isNextDisabled() {
    switch (step) {
      case 1: {
        if (urlForm.length && shipForm.ship.length && shipForm.code.length)
          return false;
        else return true;
      }
      case 2: {
        if (secretForm.length) return false;
        else return true;
      }
      default:
        return true;
    }
  }

  return (
    <div className="flex-col mt-3 h-[250px] items-center justify-items-center">
      <p className="font-bold my-2">
        Welcome to Knox, your web2 password vault.
      </p>

      {step === 1 && (
        <div className="flex flex-col mt-4 items-center h-[180px]">
          <p className="mb-2">Enter the url where you connect to your ship:</p>
          <input
            className="border border-black w-3/5 mb-2 px-3 py-1"
            name="url"
            value={urlForm}
            onChange={handleUrlForm}
            placeholder="url"
          />
          <p className="mb-2">Enter your ship and code:</p>
          <input
            name="ship"
            placeholder="ship"
            value={shipForm.ship}
            className="border border-black w-3/5 mb-1 px-3 py-1"
            onChange={handleShipForm}
          />
          <input
            name="code"
            className="border border-black w-3/5 mb-1 px-3 py-1"
            value={shipForm.code}
            onChange={handleShipForm}
            placeholder="code"
            type="password"
          />
          {urlError && (
            <p className="text-red-500 font-bold mt-1">{urlError}</p>
          )}
          {shipError && (
            <p className="text-red-500 font-bold mt-1">{shipError}</p>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col mt-4 pt-12 items-center h-[180px]">
          <p className="mb-2">Enter your Knox secret:</p>
          <input
            name="secret"
            value={secretForm}
            onChange={handleSecretForm}
            className="border border-black w-3/5 mb-2 px-3 py-1"
          />
          {secretError && (
            <p className="text-red-500 font-bold mt-2">{secretError}</p>
          )}
        </div>
      )}
      <div className="flex justify-center mt-2 pb-4">
        <button
          disabled={step === 1}
          onClick={handlePrevious}
          className={`mr-2 w-[25px] ${
            step === 1 ? "navDisabled" : "hover:scale-150"
          }`}
        >
          {navPrev()}
        </button>
        <button
          disabled={isNextDisabled()}
          onClick={handleNext}
          className={`ml-2 w-[25px] ${
            isNextDisabled() ? "navDisabled" : "hover:scale-150"
          }`}
        >
          {navNext()}
        </button>
      </div>
    </div>
  );
}
