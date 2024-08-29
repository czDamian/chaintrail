"use client";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";

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

const InjectedWallet = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider refetchInterval={0}>
          <RainbowKitSiweNextAuthProvider>
            <RainbowKitProvider
              chains={config.chains}
              theme={darkTheme()}
              modalSize="compact">
              <div className="rounded-lg">
                <ConnectButton />
              </div>
              {children}
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default InjectedWallet;
