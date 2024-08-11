"use client";
import React from "react";

const DisconnectButton = ({ onDisconnect }) => (
  <button
    onClick={onDisconnect}
    className="bg-red-500 text-white px-4 py-2 rounded-md mt-4">
    Disconnect Wallet
  </button>
);

export default DisconnectButton;
