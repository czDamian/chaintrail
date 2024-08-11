// components/ConnectWallet.js
"use client";

import { useState } from "react";
import { useSDK } from "@metamask/sdk-react";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const { sdk, connected, connecting, chainId } = useSDK();

  const connectWallet = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("Failed to connect:", err);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} style={{ padding: 10, margin: 10 }}>
        {connecting
          ? "Connecting..."
          : account
          ? `Connected: ${account}`
          : "Connect Wallet"}
      </button>
      {connected && (
        <div>
          {chainId && `Connected chain: ${chainId}`}
          <p></p>
          {account && `Connected account: ${account}`}
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
