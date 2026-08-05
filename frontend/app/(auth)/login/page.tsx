"use client";

/**
 * Login Page — /login
 *
 * Layout: 2 columns
 *   - Left  : Full cover image with dark overlay and branding
 *   - Right : Email + password login form via Supabase Auth
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
    <main className="flex min-h-screen w-full">
      {/* ── Left: Cover Image Panel ──────────────────────────────────────── */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        {/* Full cover image */}
        <Image
          src="/cover.jpg"
          alt="Supply Chain Intelligence Center — PT Indoprima"
          fill
          className="object-cover"
          priority
        />

        {/* Bottom: Tagline */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <p className="text-white text-2xl font-semibold font-poppins leading-snug tracking-tight drop-shadow-lg">
            AI-Powered Supply Chain
            <br />
            Decision Intelligence
          </p>
          <p className="text-blue-200/75 text-sm font-poppins mt-3 leading-relaxed max-w-[380px]">
            Real-time visibility across your entire supply chain — from demand
            forecasting to invoice reconciliation, powered by AI.
          </p>
        </div>
      </div>

      {/* ── Right: Login Form ─────────────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12"
        style={{ background: "#f8fafc" }}
      >
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
            >
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-base leading-none font-poppins">
                SCIC
              </p>
              <p className="text-gray-400 text-xs leading-none mt-0.5 font-poppins">
                PT Indoprima
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-poppins">
              Sign in to Supply Chain Intelligence Center
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 font-poppins"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@indoprima.co.id"
                className={`w-full h-11 px-3.5 rounded-xl text-sm font-poppins bg-white transition-all duration-200 outline-none
                  ${
                    errors.email
                      ? "border-2 border-red-400 focus:border-red-500"
                      : "border border-gray-200 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10"
                  }`}
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-poppins mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 font-poppins"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`w-full h-11 px-3.5 pr-11 rounded-xl text-sm font-poppins bg-white transition-all duration-200 outline-none
                    ${
                      errors.password
                        ? "border-2 border-red-400 focus:border-red-500"
                        : "border border-gray-200 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10"
                    }`}
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
                  {...register("password")}
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                <p className="text-xs text-red-500 font-poppins mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="btn-signin"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl text-sm font-semibold text-white font-poppins transition-all duration-200 flex items-center justify-center gap-2 mt-2
                disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isSubmitting
                  ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                  : "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 4px 15px rgba(99, 102, 241, 0.35)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Sign in to SCIC"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 font-poppins mt-8 leading-relaxed">
            Accounts are managed by PT Indoprima administrators.
            <br />
            Contact your admin if you have trouble accessing.
          </p>
        </div>
      </div>
    </main>
  );
}
