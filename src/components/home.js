/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Suggestion } from "./suggestion";
import { getStorage } from "../storage";
import { generatePassword, aesDecrypt } from "../utils";

import {
  generateIcon,
  lockIcon,
  expandIcon,
  refreshIcon,
  copyIcon,
  closeIcon,
} from "../icons";

export function Home() {
  const navigate = useNavigate();
  const [spin, setSpin] = useState(false);
  const [secret, setSecret] = useState("");
  const [generateShake, setGenerateShake] = useState(false);
  const [generated, setGenerated] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [lockShake, setLockShake] = useState(false);

  useEffect(() => {
    // TODO: no else here, do I need a catch in case of runtime busted?
    chrome.runtime.sendMessage({ type: "getState" }, (res) => {
      const { suggestion, secret } = res.state;
      setSecret(secret);

      if (!suggestion) {
        return;
      } else {
        setSuggestion(true);
        setSugForm({
          website: suggestion.website,
          username: suggestion.newUsername,
          password: suggestion.newPassword,
        });
      }
    });
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (message) {
      if (message.generated) {
        setGenerated(generatePassword(message.generated.enty));
      }
    });
  }, []);

  function handleGenerate() {
    setGenerateShake(true);
    chrome.runtime.sendMessage({ type: "generate" });
    setTimeout(() => {
      setGenerateShake(false);
    }, 300);
  }

  function handleRefresh() {
    setSpin(true);
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: "scryVault" });
    setTimeout(() => {
      setSpin(false);
    }, 500);
  }

  async function handleOpenKnox() {
    if (!secret) return navigate("/secret");
    const { shipCreds } = await getStorage("shipCreds");
    chrome.tabs.create({
      url: `${aesDecrypt(shipCreds?.url, secret)}/apps/knox`,
    });
  }

  function handleLock() {
    setLockShake(true);
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: "lock" });
    setTimeout(() => {
      navigate("/secret");
    }, 300);
  }

  function handleCopy() {
    setShowCopied(true);
    navigator.clipboard.writeText(generated);
    setTimeout(() => {
      setShowCopied(false);
    }, 2500);
  }

  return (
    <div className="flex flex-col mt-4 min-h-[220px]">
      <p className="mb-3">Knox - your password vault</p>
      <div className="border-t border-b border-black mt-1 py-1 w-full bg-whiteSmoke">
        <div className="flex hover:bg-timberwolf">
          <button
            onClick={handleGenerate}
            className="w-full flex py-2"
            title="generate password"
          >
            <div className={`px-1 ${generateShake ? "shakeX" : null}`}>
              {generateIcon()}
            </div>
            <p className="">Generate password</p>
          </button>
        </div>

        <div className="flex hover:bg-timberwolf">
          <button
            onClick={handleRefresh}
            className="w-full flex py-2"
            title="refresh"
          >
            <div className={`px-1 ${spin ? "refresh" : null}`}>
              {refreshIcon()}
            </div>
            <p style={{ transform: "translateY(1px)" }} className="">
              Refresh
            </p>
          </button>
        </div>

        <div className="flex hover:bg-timberwolf">
          <button
            onClick={handleOpenKnox}
            className="w-full flex py-2"
            title="open knox"
          >
            <div className={"px-1"}>{expandIcon()}</div>
            <p className="">Expand view</p>
          </button>
        </div>

        <div className="flex hover:bg-timberwolf">
          <button
            onClick={handleLock}
            className="w-full flex py-2"
            title="lock"
          >
            <div className={`px-1 ${lockShake ? "lockShake" : null}`}>
              {lockIcon()}
            </div>
            <p className="">Lock</p>
          </button>
        </div>
      </div>

      {generated && (
        <div className="flex w-full my-2">
          <div className="flex-none w-[18px]"></div>
          <div className="grow">
            <div className="flex flex-col">
              <div className="flex justify-center">
                <button className="hover:text-base" onClick={handleCopy}>
                  {generated}
                </button>
                {showCopied && <span className="flex ml-1">{copyIcon()}</span>}
              </div>
              <p>click to copy</p>
            </div>
          </div>
          <div>
            <button
              className="flex-none w-[18px]"
              onClick={() => setGenerated("")}
            >
              {closeIcon()}
            </button>
          </div>
        </div>
      )}

      {/* TODO finish suggestion  */}
      <div className="hidden">
        <Suggestion />
      </div>
    </div>
  );
}
