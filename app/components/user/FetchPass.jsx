"use client";
import { useEffect, useState } from "react";

const FetchPass = () => {
  const [playPass, setPlayPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserPasses = async (userId) => {
      try {
        const response = await fetch(`/api/users?userId=${userId}`, {
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

    // Retrieve userId from local storage
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetchUserPasses(userId);
    } else {
      setError("User ID not found in local storage");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="text-xs gap-1 flex items-center">
        <img src="../ticket.png" alt="Chain Coins" className="w-6 h-6" />
        <span>000</span>
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

  return (
    <div className="text-xs gap-1 flex items-center">
      <img src="../ticket.png" alt="Chain Coins" className="w-6 h-6" />
      <span>{playPass}</span>
    </div>
  );
};

export default FetchPass;
