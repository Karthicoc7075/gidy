'use client'
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function WelcomeProfileSetup() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [avatar, setAvatar] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [category, setCategory] = useState("");
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
      } else if (user.onboardingCompleted) {
        window.location.href = "/dashboard";
      } else {
        setIsChecking(false);
      }
    } catch (error) {

      console.error("Invalid token:", error);
      setUser(null);
      window.location.href = "/signin";
    }
  }, [isLoading]);




  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  const openFile = () => fileRef.current?.click();

  const canContinue = firstName.trim() !== "" && lastName.trim() !== "" && category.trim() !== "";

  const handleSubmit = async () => {
    if (!canContinue) return;

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("descriptionType", category);
    if (fileRef.current?.files?.[0]) {
      formData.append("image", fileRef.current.files[0]);
    }

    try {
      const res = await axios.post("/api/profile/onboarding", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`
        },


      });

      setUser({ ...user, ...res.data.user });
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Onboarding error:", err);
      alert("Failed to complete onboarding. Please try again.");
    }




  }
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-[480px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md p-10">
        \
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Welcome to Gidy!
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-8">
          Let's get you started with your profile setup
        </p>


        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24  flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                />
              ) : (
                <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" color="#9ca3af" height="80" width="80" xmlns="http://www.w3.org/2000/svg" ><path d="M313.6 304c-28.7 0-42.5 16-89.6 16-47.1 0-60.8-16-89.6-16C60.2 304 0 364.2 0 438.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-25.6c0-74.2-60.2-134.4-134.4-134.4zM400 464H48v-25.6c0-47.6 38.8-86.4 86.4-86.4 14.6 0 38.3 16 89.6 16 51.7 0 74.9-16 89.6-16 47.6 0 86.4 38.8 86.4 86.4V464zM224 288c79.5 0 144-64.5 144-144S303.5 0 224 0 80 64.5 80 144s64.5 144 144 144zm0-240c52.9 0 96 43.1 96 96s-43.1 96-96 96-96-43.1-96-96 43.1-96 96-96z"></path></svg>
              )}
            </div>


            <button
              type="button"
              onClick={openFile}
              className="absolute bottom-0 right-0 border-2 border-white bg-blue-500 text-white rounded-full p-2 shadow hover:bg-blue-600"
            >
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg"><circle cx="256" cy="272" r="64"></circle><path d="M432 144h-59c-3 0-6.72-1.94-9.62-5l-25.94-40.94a15.52 15.52 0 00-1.37-1.85C327.11 85.76 315 80 302 80h-92c-13 0-25.11 5.76-34.07 16.21a15.52 15.52 0 00-1.37 1.85l-25.94 41c-2.22 2.42-5.34 5-8.62 5v-8a16 16 0 00-16-16h-24a16 16 0 00-16 16v8h-4a48.05 48.05 0 00-48 48V384a48.05 48.05 0 0048 48h352a48.05 48.05 0 0048-48V192a48.05 48.05 0 00-48-48zM256 368a96 96 0 1196-96 96.11 96.11 0 01-96 96z"></path></svg>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="absolute top-0 left-0 w-full h-full opacity-0"
            />
          </div>

          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-3">
            Click to upload your profile picture
          </p>
        </div>


        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          First Name *
        </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="w-full mt-1 mb-4 border-2 text-sm text-gray-600 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
        />


        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Last Name *
        </label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          className="w-full mt-1 mb-4 border-2 text-sm text-gray-600 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:border-blue-500   focus:ring-blue-500"
        />


        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          What Best Describes You? *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mt-1 mb-6 border-2 text-sm text-gray-600 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select or type your category</option>
          <option>Student</option>
          <option>Fresher / Graduate</option>
          <option>Working Professional</option>
          <option>Freelancer</option>
          <option>Startup Founder</option>
        </select>


        <button
          onClick={handleSubmit}
          className={`w-full rounded-lg py-2.5 font-medium transition ${"bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );

}
