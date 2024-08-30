"use client";
import { useState, useEffect } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  WagmiProvider,
  createConfig,
  useAccount,
  useSignMessage,
  useConnect,
  useDisconnect,
} from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SiweMessage } from "siwe";

import "@rainbow-me/rainbowkit/styles.css";

// Define the Open Campus Codex Sepolia network
const openCampusCodexSepolia = {
  id: 0xa045c,
  name: "Sepolia",
  network: "open-campus-codex-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "EDU",
    symbol: "EDU",
  },
  rpcUrls: {
    public: { http: ["https://open-campus-codex-sepolia.drpc.org"] },
    default: { http: ["https://open-campus-codex-sepolia.drpc.org"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://opencampus-codex.blockscout.com",
    },
  },
  iconUrl:
    "https://www.opencampus.xyz/static/media/coin-logo.39cbd6c42530e57817a5b98ac7621ca7.svg",
};

const config = getDefaultConfig({
  appName: "Chain Trail",
  projectId: "24911ae43d4f2f85e9408da2d8c99868",
  chains: [openCampusCodexSepolia, mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

function CustomConnectButton() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [signInError, setSignInError] = useState(null);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    const checkPersistence = async () => {
      const persistedState = localStorage.getItem("walletConnection");
      if (persistedState && isConnected) {
        const { isSigned: storedIsSigned } = JSON.parse(persistedState);
        setIsSigned(storedIsSigned);
      }
    };

    checkPersistence();
  }, [isConnected]);

  const generateNonce = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const signMessage = async () => {
    try {
      const nonce = generateNonce();
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement:
          "Sign in with Ethereum to the app. You are not paying for any transaction",
        uri: window.location.origin,
        version: "1",
        chainId: 1,
        nonce: nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      console.log("Signature:", signature);
      // Here you would typically send the message and signature to your server for verification
      console.log("Successfully signed in!");
      setSignInError(null);
      setIsSigned(true);

      // Persist the connection state including the signed status
      localStorage.setItem(
        "walletConnection",
        JSON.stringify({ address, isSigned: true })
      );
    } catch (error) {
      console.error("Error signing in:", error);
      setSignInError(error.message);
    }
  };

  const handleDisconnect = async () => {
    await disconnectAsync();
    localStorage.removeItem("walletConnection");
    setIsSigned(false);
  };

  if (!isConnected) {
    return <ConnectButton />;
  }

  if (isConnected && !isSigned) {
    return (
      <div>
        <button
          onClick={signMessage}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
          Sign Message
        </button>
        {signInError && <p className="text-red-500 mt-2">{signInError}</p>}
      </div>
    );
  }

  if (isConnected && isSigned) {
    return (
      <div>
        <ConnectButton chainStatus="none" showBalance={false} />
      </div>
    );
  }
}

const RainbowWallet = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={config.chains}
          theme={darkTheme()}
          modalSize="compact">
          {mounted && (
            <>
              <div className="rounded-lg">
                <CustomConnectButton />
              </div>
              {children}
            </>
          )}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowWallet;
