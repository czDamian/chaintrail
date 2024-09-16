"use client";
import { useState, useEffect } from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, useAccount, useDisconnect } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, avalancheFuji } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useAuth } from "../AuthenticationProvider";
import { useRouter } from "next/navigation";

import "@rainbow-me/rainbowkit/styles.css";
import Button from "../components/Reusable/Button";

// Define the Avalanche Fuji network
const avalancheFujiNetwork = {
  ...avalancheFuji,
  iconUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
};

const config = getDefaultConfig({
  appName: "Chain Trail",
  projectId: "24911ae43d4f2f85e9408da2d8c99868",
  chains: [avalancheFujiNetwork, mainnet, polygon, optimism, arbitrum, base],
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
      router.push("/");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  };

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      onClick={openConnectModal}
                      className=" bg-slate-900 text-xs md:text-base animate-bounce-in-down flex items-center gap-2 justify-center">
                      <p>Connect</p>
                      <img
                        src="metamask.svg"
                        alt="metamask"
                        width={20}
                        height={20}
                      />
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button onClick={openChainModal} className="text-white bg-red-500 hover:bg-red-600 text-xs rounded-md">
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Button
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                      className="text-white bg-gray-800 hover:bg-gray-700 text-xs rounded-md"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>

                    <Button onClick={openAccountModal} className="text-white bg-gray-800 hover:bg-gray-700 text-xs rounded-md">
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </Button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  }

  return (
    <div>
      <Button
        onClick={handleDisconnect}
        className="text-white bg-gray-950 text-xs rounded-md border border-gray-700 hover:bg-gray-800">
        Logout
      </Button>
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
