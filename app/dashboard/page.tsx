"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Profile from "@/app/user-profile/:profileId/page";
import { useUser } from "@/context/UserContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { User } from "@/context/UserContext";

export default function Dashboard() {
  const { user, setUser, isLoading } = useUser();
  const [isChecking, setIsChecking] = useState(true);


  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      window.location.href = "/signin";
      return;
    }
    try {
      const decoded: any = jwtDecode(user.token as string);

      if (decoded.exp * 1000 < Date.now()) {
        setUser(null);
        window.location.href = "/signin";
      } else if (!user.onboardingCompleted) {
        window.location.href = "/onboarding";
      } else {
        fetchProfile();
      }
    } catch (error) {

      console.error("Invalid token:", error);
      setUser(null);
      window.location.href = "/signin";
    }
  }, [isLoading]);





  async function fetchProfile() {
    try {
      const response = await axios.get("/api/profile/main", {
        headers: {

          Authorization: `Bearer ${user?.token}`,
        },
      });
      const profileData = response.data;
      if (user) {
        setUser({ ...user, ...profileData });
        setIsChecking(false);
      }

    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }




  return (
    <div>
      {isChecking ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : (
        <>
          <Navbar />
          <Profile />
        </>
      )}
    </div>
  );
}