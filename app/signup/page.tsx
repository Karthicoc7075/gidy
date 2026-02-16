'use client';

import { useState, useMemo } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { useUser } from "@/context/UserContext";
import axios from "axios";


export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rulesShown, setRulesShown] = useState(false);
  const { user, setUser } = useUser();


  const rules = useMemo(() => {
    const lower = /[a-z]/.test(password);
    const upper = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[!@#$%^&*]/.test(password);
    const length = password.length >= 8;

    const categoryCount = [lower, upper, number, special].filter(Boolean).length;
    const valid = length && categoryCount >= 4;

    return { lower, upper, number, special, length, valid };
  }, [password]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setRulesShown(true);
  };

  if (user && user.onboardingCompleted) {
    window.location.href = "/dashboard";
  } else if (user && !user.onboardingCompleted) {
    window.location.href = "/onboarding";
  }

  const handleSubmit = async () => {
    if (!rules.valid) return;

    if (!email) {
      alert("Email is required");
      return;
    }

    try {
      const res = await axios.post("/api/auth/signup", { email, password });


      setUser(res.data.data);
      window.location.href = "/onboarding";
    } catch (err) {
      console.error("Signup error:", err);
      alert( "Failed to create account. Please try again or already have an account? Sign in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[420px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">


        <div className="flex justify-center mb-4">
          <img
            src="https://gidy-content-p.s3.us-west-2.amazonaws.com/Png/Gidy_logo_small_white_bg.png"
            alt="logo"
            className="w-[52px] h-[52px]"
          />
        </div>


        <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
          Create Account
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2 mb-6">
          By signing up, I accept the GIDY Terms of Service and
          acknowledge the Privacy Policy.
        </p>


        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email address *"
          className="w-full border rounded-sm border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2.5 mb-3 outline-none focus:ring-1 focus:ring-blue-500"
        />


        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password *"
            className={`w-full border rounded-sm border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2.5 pr-10 outline-none focus:ring-1 focus:ring-blue-500 transition ${rulesShown && !rules.valid
                ? "!border-red-500 focus:ring-red-500"
                : rulesShown && rules.valid
                  ? "!border-emerald-500 focus:ring-emerald-500"
                  : ""
              }`}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {rulesShown && (
          <div className="border border-gray-300 dark:border-gray-600 rounded-sm p-4 mb-6 bg-gray-50 dark:bg-gray-700">
            <p className="text-sm mb-2 font-medium">
              Your password must contain:
            </p>

            <ul className="space-y-1 text-sm">
              <Rule ok={rules.length}>At least 8 characters</Rule>

              <Rule ok={
                [rules.lower, rules.upper, rules.number, rules.special]
                  .filter(Boolean).length >= 3
              }>
                At least 3 of the following:
              </Rule>

              <div className="ml-5 space-y-1">
                <Rule ok={rules.lower}>Lower case letters (a-z)</Rule>
                <Rule ok={rules.upper}>Upper case letters (A-Z)</Rule>
                <Rule ok={rules.number}>Numbers (0-9)</Rule>
                <Rule ok={rules.special}>
                  Special characters (e.g. !@#$%^&*)
                </Rule>
              </div>
            </ul>
          </div>
        )}


        <button
          onClick={handleSubmit}

          className={`w-full rounded-sm py-2.5 font-medium transition ${"bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          Continue
        </button>

        <p className="text-sm  mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 font-bold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}


function Rule({
  ok,
  children,
}: {
  ok: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className={`flex items-center gap-2 transition ${ok ? "text-emerald-600" : "text-gray-600 dark:text-gray-400"
      }`}>
      <Check size={16} />
      {children}
    </li>
  );
}
