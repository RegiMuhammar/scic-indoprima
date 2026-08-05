"use client";

/**
 * Login Page — /login
 *
 * Layout: 2 columns
 *   - Left  : Full cover image with dark overlay, branding, and white text
 *   - Right : Dark pitch background (#000000) with glass-effect form controls
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

// ─── Validation Schema ────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      toast.error("Login failed", {
        description: error.includes("Invalid login credentials")
          ? "Incorrect email or password. Please try again."
          : error,
      });
      return;
    }

    toast.success("Login successful!", {
      description: "Redirecting to dashboard...",
    });
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen w-full bg-[#000000] text-white font-poppins">
      {/* ── Left: Cover Image Panel ──────────────────────────────────────── */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        {/* Full cover image */}
        <Image
          src="/cover.jpg"
          alt="Supply Chain Intelligence Center — PT Indoprima"
          fill
          className="object-cover opacity-90"
          priority
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

        {/* Bottom: Tagline */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <p className="text-white text-2xl font-bold font-poppins leading-snug tracking-tight drop-shadow-lg">
            AI-Powered Supply Chain
            <br />
            Decision Intelligence
          </p>
          <p className="text-white text-sm font-poppins mt-3 leading-relaxed max-w-[420px]">
            Real-time visibility across your entire supply chain — from demand
            forecasting to invoice reconciliation, powered by AI.
          </p>
        </div>
      </div>

      {/* ── Right: Dark Glass Login Form ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-[#000000] border-l border-white/10">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-none border border-white/20 bg-white/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-base leading-none font-poppins">
                SCIC
              </p>
              <p className="text-white/40 text-xs leading-none mt-0.5 font-poppins">
                PT Indoprima
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white font-poppins tracking-tight">
              Welcome back
            </h1>
            <p className="text-white/40 text-sm mt-2 font-poppins">
              Sign in to Supply Chain Intelligence Center
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-white/70 font-poppins"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@indoprima.co.id"
                className={`w-full h-11 px-3.5 rounded-none text-sm font-poppins bg-[#121212] text-white placeholder:text-white/30 transition-all duration-200 outline-none
                  ${
                    errors.email
                      ? "border border-red-500 focus:border-red-400"
                      : "border border-white/10 focus:border-white/30 focus:bg-[#181818]"
                  }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-400 font-poppins mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-white/70 font-poppins"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`w-full h-11 px-3.5 pr-11 rounded-none text-sm font-poppins bg-[#121212] text-white placeholder:text-white/30 transition-all duration-200 outline-none
                    ${
                      errors.password
                        ? "border border-red-500 focus:border-red-400"
                        : "border border-white/10 focus:border-white/30 focus:bg-[#181818]"
                    }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-poppins mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Liquid Glass Effect Submit Button */}
            <button
              id="btn-signin"
              type="submit"
              disabled={isSubmitting}
              className="liquid-glass w-full h-11 rounded-full text-xs font-semibold text-white font-poppins hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 transform flex items-center justify-center gap-2 mt-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Verifying...
                </>
              ) : (
                "Sign in to SCIC"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-[11px] text-white/30 font-poppins mt-8 leading-relaxed">
            Accounts are managed by PT Indoprima administrators.
            <br />
            Contact your admin if you have trouble accessing.
          </p>
        </div>
      </div>
    </main>
  );
}
