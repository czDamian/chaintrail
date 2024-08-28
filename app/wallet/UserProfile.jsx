"use client";
import { useRouter } from "next/navigation";
import Loader from "../loader";
import UserInfo from "./UserInfo";
import WalletSection from "./WalletSection";
import { useAuth } from "@/app/AuthenticationProvider";

export default function UserProfile() {
  const { userInfo, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading || !userInfo) {
    return <Loader />;
  }

  return (
    <div className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] dark:shadow-gray-700/25 mt-20 mx-8">
      <div className="flex flex-col items-center rounded-[10px] p-4 bg-gray-900">
        <div className="w-full max-w-4xl p-6">
          <div className="mb-6 flex items-center gap-2 text-gold-500">
            <h2 className="text-2xl font-semibold">My Profile</h2>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <UserInfo userInfo={userInfo} />
            <WalletSection userInfo={userInfo} router={router} />
          </div>
        </div>
      </div>
    </div>
  );
}
