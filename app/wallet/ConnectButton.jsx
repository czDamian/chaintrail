"use client";
import { useState, useEffect } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, useAccount, useDisconnect } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useAuth } from "../AuthenticationProvider";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { registerUser } = useAuth();
  useEffect(() => {
    if (isConnected && address) {
      registerUser(address, "", "wallet");
    }
  }, [isConnected, address, registerUser]);

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
      const cookies = Cookies.get();
      Object.keys(cookies).forEach((cookieName) => {
        Cookies.remove(cookieName, { path: "/" });
      });

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };


  if (!isConnected) {
    return <ConnectButton />;
  }

  return (
    <div>
      <button
        onClick={handleDisconnect}
        className="px-4 py-2 text-white bg-gray-950 text-base rounded-md border border-gray-700">
        Sign Out
      </button>
    </div>
  );
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
          theme={darkTheme({
            accentColor: "#E4AD00",
            accentColorForeground: "black",
            borderRadius: "medium",
            fontStack: "system",
          })}
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
