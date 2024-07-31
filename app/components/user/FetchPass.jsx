"use client";
import { useEffect, useState } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";

const FetchPass = () => {
  const { userInfo, isLoading } = useTelegramAuth();
  const [playPass, setPlayPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserPasses = async (userId) => {
      try {
        const response = await fetch(`/api/register?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setPlayPass(data.playPass);
        } else {
          setError(data.message || "Failed to fetch passes");
        }
      } catch (error) {
        console.error("Error fetching passes:", error);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.id) {
      fetchUserPasses(userInfo.id);
    }
  }, [userInfo]);

  if (isLoading || loading) {
    return (
      <div className="text-xs border p-2 rounded bg-neutral-950 mt-4">
        Login to view pass balance...
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="text-xs border p-2 rounded bg-neutral-950 mt-4">
        User not logged in
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs border p-2 rounded bg-neutral-950 mt-4 text-red-500">
        {error}
      </div>
    );
  }

  return <div>Play Passes: {playPass}</div>;
};

export default FetchPass;
