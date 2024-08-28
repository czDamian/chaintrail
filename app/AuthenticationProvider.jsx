"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { CgClose } from "react-icons/cg";
import Toast from "./components/Reusable/Toast";
import Cookies from "js-cookie";

const AuthContext = createContext();

export default function AuthenticationProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const router = useRouter();

  const fetchUserInfo = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users?userId=${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);

        // Save user info to cookies
        Cookies.set("userInfo", JSON.stringify(userData), { expires: 1 }); // expires in 1 day
      } else {
        console.error("Failed to fetch user data");
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerUser = useCallback(
    async (userId, username, method) => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, username, method }),
        });

        if (response.ok) {
          await fetchUserInfo(userId); // Fetch user details after successful registration
          router.refresh();
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserInfo, router]
  );

  const handleWalletConnect = async () => {
    try {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const walletSigner = await web3Provider.getSigner();
        const address = await walletSigner.getAddress();

        if (address) {
          setIsWalletPopupOpen(false);
          await registerUser(address, "", "wallet");
        } else {
          console.error("Failed to get wallet address");
        }
      } else {
        toast.error("Please install MetaMask extension!");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("Error connecting to wallet.");
    }
  };

  const logout = useCallback(() => {
    setUserInfo(null);
    Cookies.remove("userInfo");
    router.refresh();
  }, []);

  useEffect(() => {
    // Load user info from cookies on page load
    const storedUserInfo = Cookies.get("userInfo");
    if (storedUserInfo) {
      const userData = JSON.parse(storedUserInfo);
      setUserInfo(userData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    if (window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      const app = window.Telegram.WebApp;
      app.ready();
      app.expand();
      app.enableClosingConfirmation();

      if (user && user.id) {
        registerUser(user.id.toString(), user.username || "", "telegram");
      }
    }
  }, [registerUser]);

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLoading,
        registerUser,
        fetchUserInfo,
        logout,
        handleWalletConnect,
      }}>
      {children}
      <ToastContainer />
      {isWalletPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-950 rounded-lg shadow-xl w-80">
            <div className="p-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsWalletPopupOpen(false)}
                  className="text-gray-500 my-2 p-1 hover:text-gray-700 text-lg">
                  <CgClose />
                </button>
              </div>
              <div className="space-y-4 py-2 text-lg">
                <div
                  onClick={handleWalletConnect}
                  className="flex items-center justify-between px-2 py-4 hover:bg-slate-900 rounded">
                  <p>Connect Wallet</p>
                  <img
                    src="metamask.svg"
                    alt="metamask"
                    width={30}
                    height={30}
                  />
                </div>
              </div>
            </div>
          </div>
          <Toast
            message="Please install MetaMask extension!"
            borderLeftColor="border-l-red-500"
          />
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
