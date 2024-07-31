"use client";
import { useEffect, useState } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";

const FetchPoints = () => {
  const { userInfo, isLoading } = useTelegramAuth();
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserPoints = async (userId) => {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        if (response.ok) {
          setPoints(data.points);
        } else {
          setError(data.message || "Failed to fetch points");
        }
      } catch (error) {
        console.error("Error fetching points:", error);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.id) {
      fetchUserPoints(userInfo.id);
    }
  }, [userInfo]);

  if (isLoading || loading) {
    return <div className="text-xs">Loading...</div>;
  }

  if (!userInfo) {
    return <div className="text-xs">User not logged in</div>;
  }

  if (error) {
    return <div className="text-xs text-red-500">{error}</div>;
  }

  return <div>Points: {points}</div>;
};

export default FetchPoints;
