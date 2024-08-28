"use client";

import React from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "@rainbow-me/rainbowkit/styles.css";

// Define the Open Campus Codex Sepolia network
const openCampusCodexSepolia = {
  id: 0xa045c,
  name: "Open Campus Sepolia",
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
  appName: "My RainbowKit App",
  projectId: "24911ae43d4f2f85e9408da2d8c99868",
  chains: [openCampusCodexSepolia, mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
});

const queryClient = new QueryClient();

const InjectedWallet = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={config.chains}
          theme={darkTheme()}
          modalSize="compact">
          <div className="rounded-lg">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}>
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="text-blue-500 border p-2 rounded-md border-blue-500 text-sm">
                            Connect Wallet
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-6">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="flex items-center gap-2 border p-2 rounded-md border-blue-500">
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={openCampusCodexSepolia.iconUrl}
                              className="w-6 h-6"
                            />
                            <span className="text-gray-400 text-sm hidden sm:inline">
                              {chain.name}
                            </span>
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="text-blue-500 border p-2 rounded-md border-blue-500 text-sm">
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default InjectedWallet;
