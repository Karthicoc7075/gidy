'use client';
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/context/UserContext";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useUser();


  if (user && user.onboardingCompleted) {
    window.location.href = "/dashboard";
  } else if (user && !user.onboardingCompleted) {
    window.location.href = "/onboarding";
  }
  const handleSubmit = async () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to log in. Please try again.");
        return;
      }
      

      setUser(data.data);
      alert("Logged in successfully!");
    } catch (err) {
      console.error("Signin error:", err);
      alert("Failed to log in. Please try again.");
    }

  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[380px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">

        <div className="flex justify-center mb-4">
          <img src="https://gidy-content-p.s3.us-west-2.amazonaws.com/Png/Gidy_logo_small_white_bg.png" alt="logo" className='w-[52px] h-[52px]' />
        </div>

        <h2 className="text-center text-2xl font-medium text-gray-800 dark:text-white">
          Welcome
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4 mb-6">
          Log in to GIDY!
        </p>




        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address *"
          className={`w-full border rounded-sm border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2.5 mb-3 outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? "!border-red-500 focus:ring-red-500" : ""}`}
        />


        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password *"
            className={`w-full border rounded-sm border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2.5 pr-10 outline-none focus:ring-1 focus:ring-blue-500 ${errors.password ? "!border-red-500 focus:ring-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>


        <div className="text-right mt-2 mb-6">
          <a href="#" className="text-blue-600 text-sm hover:underline">
            Forgot password?
          </a>
        </div>


        <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-medium transition">
          Continue
        </button>


        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don't have an account? {""}
          <a href="/signup" className="text-blue-600 font-bold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
