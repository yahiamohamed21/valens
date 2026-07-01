"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/SvgIcons";
import { api, decodeJwt } from "@/lib/api";

export default function LoginPage() {
  const { showToast, loginUser, registerCustomer } = useApp();
  const router = useRouter();

  // Active view: "login" | "signup" | "forgot" | "otp"
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "forgot" | "otp">("login");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // OTP Reset Fields
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordReset, setConfirmPasswordReset] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const success = await loginUser(email, password);
    if (success) {
      // Reset fields
      setEmail("");
      setPassword("");
      
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("valens_jwt_token") : null;
      let role = "Customer";
      if (storedToken) {
        try {
          const claims = decodeJwt(storedToken);
          if (claims) {
            role = (claims.role || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Customer") as string;
          }
        } catch (error) {
          console.error("Error decoding token for login routing:", error);
        }
      }

      if (role.toLowerCase() === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      showToast("All fields are required.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    const success = await registerCustomer(email, password, `${firstName} ${lastName}`);
    if (success) {
      // Reset fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      router.push("/dashboard");
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await api.auth.forgotPassword({ email });
      showToast(`Password recovery OTP code dispatched to ${email}`, "info");
      setActiveTab("otp");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Failed to send recovery code", "error");
      } else {
        showToast("Failed to send recovery code", "error");
      }
    }
  };

  const handleOtpResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || !newPassword || !confirmPasswordReset) {
      showToast("All fields are required.", "error");
      return;
    }

    if (newPassword !== confirmPasswordReset) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      await api.auth.resetPasswordOtp({
        otpCode,
        newPassword,
        confirmPassword: confirmPasswordReset,
      });
      showToast("Password has been reset successfully. Please log in.", "success");
      setOtpCode("");
      setNewPassword("");
      setConfirmPasswordReset("");
      setEmail("");
      setActiveTab("login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message || "Failed to reset password", "error");
      } else {
        showToast("Failed to reset password", "error");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-foreground">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-coral/5 blur-[120px] pointer-events-none" />

        {/* Auth Panel Box */}
        <div className="w-full max-w-md rounded-3xl border border-border-color bg-card-bg p-8 shadow-2xl glass-panel relative overflow-hidden">
          
          {/* logo accent glow */}
          <div className="absolute top-0 left-1/2 h-1 w-20 -translate-x-1/2 bg-primary-coral rounded-full blur-[1px]" />
          
          <div className="text-center mb-8">
            <span className="text-glow text-xl font-black tracking-widest text-primary-coral">VALENS</span>
            <span className="block text-4xs text-muted-text mt-1 uppercase tracking-widest font-bold">Elite Performance Club</span>
          </div>

          {/* Login tab header switcher */}
          {activeTab !== "forgot" && (
            <div className="grid grid-cols-2 rounded-xl bg-surface-deep p-1 mb-6 border border-border-color/30">
              <button
                onClick={() => setActiveTab("login")}
                className={`rounded-lg py-2.5 text-2xs font-extrabold uppercase tracking-wider transition-luxury ${
                  activeTab === "login"
                    ? "bg-card-bg text-white shadow-lg border border-border-color/30"
                    : "text-muted-text hover:text-gray-800"
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`rounded-lg py-2.5 text-2xs font-extrabold uppercase tracking-wider transition-luxury ${
                  activeTab === "signup"
                    ? "bg-card-bg text-white shadow-lg border border-border-color/30"
                    : "text-muted-text hover:text-gray-800"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Form Content */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white placeholder-muted-text focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab("forgot")}
                    className="text-4xs font-bold text-primary-coral hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div className="flex items-center gap-3 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  id="remember_me"
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 cursor-pointer h-4 w-4"
                />
                <label htmlFor="remember_me" className="text-3xs font-semibold text-white hover:text-gray-800 cursor-pointer uppercase tracking-wider">
                  Remember my session details
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-all duration-300 shadow-lg shadow-primary-coral/10 hover:scale-[1.01] cursor-pointer"
              >
                AUTHENTICATE
                <Icon name="lock" size={14} />
              </button>
            </form>
          )}

          {activeTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                  />
                </div>
                <div>
                  <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create Secure Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Verify Secure Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div className="flex items-center gap-3 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  id="terms_agree"
                  className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 cursor-pointer h-4 w-4"
                />
                <label htmlFor="terms_agree" className="text-3xs font-semibold text-white hover:text-gray-800 cursor-pointer uppercase tracking-wider">
                  I agree to the terms of athlete membership *
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-all duration-300 shadow-lg shadow-primary-coral/10 hover:scale-[1.01] cursor-pointer"
              >
                CREATE ELITE STACK
                <Icon name="check" size={14} />
              </button>
            </form>
          )}

          {activeTab === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <p className="text-xs text-muted-text leading-relaxed text-center mb-2 uppercase font-bold tracking-wide">
                Provide your registered email address. We will dispatch a secure link to reset your credentials.
              </p>
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-all duration-300 hover:scale-[1.01] cursor-pointer"
              >
                SEND RECOVERY LINK
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-3xs font-black uppercase tracking-wider text-muted-text hover:text-gray-800 text-center mt-3"
              >
                Back to Authentication
              </button>
            </form>
          )}

          {activeTab === "otp" && (
            <form onSubmit={handleOtpResetSubmit} className="flex flex-col gap-4 animate-fade-in">
              <p className="text-xs text-muted-text leading-relaxed text-center mb-2 uppercase font-bold tracking-wide">
                Enter the 6-digit OTP sent to your email and your new password.
              </p>
              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">OTP Verification Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral text-center tracking-widest font-bold"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <div>
                <label className="block text-4xs font-extrabold uppercase tracking-widest text-muted-text mb-2">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Verify New Password"
                  value={confirmPasswordReset}
                  onChange={(e) => setConfirmPasswordReset(e.target.value)}
                  className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                />
              </div>

              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-[#180f0d] hover:bg-white hover:text-[#180f0d] transition-all duration-300 shadow-lg hover:scale-[1.01] cursor-pointer"
              >
                RESET CREDENTIALS
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-3xs font-black uppercase tracking-wider text-muted-text hover:text-gray-800 text-center mt-3"
              >
                Cancel & Back to Log In
              </button>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
