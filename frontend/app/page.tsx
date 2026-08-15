"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState<boolean>(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    const checkShouldLoad = () => {
      const isDesktop = window.innerWidth >= 768;
      const isSaveData =
        (navigator as unknown as { connection?: { saveData?: boolean } })?.connection?.saveData === true;
      setShouldLoadVideo(isDesktop && !isSaveData);
    };

    checkShouldLoad();
    window.addEventListener("resize", checkShouldLoad);
    return () => window.removeEventListener("resize", checkShouldLoad);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    let isIntersecting = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && document.visibilityState === "visible") {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    observer.observe(video);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [shouldLoadVideo]);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* 1. HERO SECTION (100vh Full Viewport with Video Background) */}
      <section className="h-screen min-h-screen relative flex flex-col justify-between overflow-hidden">
        {/* Background Video (Desktop) or Aesthetic Fallback (Mobile/Save-Data) */}
        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            src="https://m0z1tso2urd7gizb.public.blob.vercel-storage.com/prims3-VkGRd7fbTyKGFcJOdIxCAOFGTTcKOP"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-zinc-950 to-black pointer-events-none" />
        )}

        {/* Navigation Bar */}
        <nav className="relative z-20 px-8 py-6 bg-transparent">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            {/* Left side: Logo & Nav links */}
            <div className="flex items-center gap-10">
              <Link href="/" className="flex items-center gap-2.5 text-white font-semibold text-base tracking-tight">
                <Globe className="w-5 h-5 text-white" />
                <span>Supply Chain Intelligence Center</span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <Link href="#overview" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                  Overview
                </Link>
                <Link href="#dashboard" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="#architecture" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                  Architecture
                </Link>
              </div>
            </div>

            {/* Right side: Action Button */}
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/10 hover:scale-105 transition-all duration-300 transform inline-block"
              >
                Explore Platform
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content Area */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[15%]">
          <h1
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          >
            Intelligence for Every Supply Chain Decision
          </h1>

          <div className="max-w-xl w-full space-y-4">
            {/* Active Email Input Waitlist Demo Form */}
            <form onSubmit={handleWaitlistSubmit} className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              {submitted ? (
                <span className="font-poppins text-emerald-400 text-sm font-medium py-1 px-2 flex-1 text-left">
                  ✓ You&apos;ve successfully joined the demo waitlist!
                </span>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email to join waitlist demo..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-poppins bg-transparent text-white placeholder-white/50 focus:outline-none text-sm px-2 flex-1 text-left"
                  />
                  <button
                    type="submit"
                    aria-label="Join Waitlist"
                    className="bg-white rounded-full p-3 text-black hover:scale-105 transition-transform flex items-center justify-center shrink-0"
                  >
                    <ArrowRight className="w-5 h-5 text-black" />
                  </button>
                </>
              )}
            </form>

            {/* Subtitle Text */}
            <p className="font-poppins text-white text-sm leading-relaxed px-4">
              Monitor Product, Material, and Delivery operations through a unified intelligence platform that transforms operational data into real-time visibility, actionable insights, and faster decision-making across the entire supply chain.
            </p>
          </div>
        </main>

        {/* Social Icons Footer */}
        <footer className="relative z-10 flex justify-center gap-4 pb-4">
          <a
            href="https://github.com/RegiMuhammar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/10 hover:scale-125 transition-all duration-300 transform flex items-center justify-center"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/regimuhammar/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/10 hover:scale-125 transition-all duration-300 transform flex items-center justify-center"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href="https://regimuhammar.ragon.id/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/10 hover:scale-125 transition-all duration-300 transform flex items-center justify-center"
          >
            <Globe className="w-5 h-5" />
          </a>
        </footer>
      </section>

      {/* 2. SEPARATE CONTAINER BELOW HERO SECTION (80% Viewport Width, 30% Scaled Down Cards) */}
      <section id="features" className="relative z-10 pt-2 pb-6 w-[80vw] max-w-[80%] mx-auto">
        {/* 3 Card Grid Content (Glass Effect, Text Only, Compact 80% Layout, Poppins Description) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Supply Chain Dashboard Health */}
          <div className="liquid-glass rounded-2xl p-5 md:p-6 border border-white/10 hover:border-white/20 transition-colors shadow-lg flex flex-col justify-center">
            <h3 className="font-poppins text-base md:text-lg font-semibold text-white mb-2 tracking-tight">
              Supply Chain Dashboard Health
            </h3>
            <p className="font-poppins text-xs md:text-sm text-white/75 leading-relaxed font-normal">
              Provides real-time operational control tower with automated health scoring, KPI monitoring, and early warning risk detection across your supply chain network.
            </p>
          </div>

          {/* Card 2: Invoice Matching Intelligence */}
          <div className="liquid-glass rounded-2xl p-5 md:p-6 border border-white/10 hover:border-white/20 transition-colors shadow-lg flex flex-col justify-center">
            <h3 className="font-poppins text-base md:text-lg font-semibold text-white mb-2 tracking-tight">
              Invoice Matching Intelligence
            </h3>
            <p className="font-poppins text-xs md:text-sm text-white/75 leading-relaxed font-normal">
              Automates line-item financial reconciliation across POs, Goods Receipts, and Invoices with intelligent discrepancy detection and complete audit trails.
            </p>
          </div>

          {/* Card 3: Demand & Inventory Decision Intelligence */}
          <div className="liquid-glass rounded-2xl p-5 md:p-6 border border-white/10 hover:border-white/20 transition-colors shadow-lg flex flex-col justify-center">
            <h3 className="font-poppins text-base md:text-lg font-semibold text-white mb-2 tracking-tight">
              Demand & Inventory Decision Intelligence
            </h3>
            <p className="font-poppins text-xs md:text-sm text-white/75 leading-relaxed font-normal">
              Leverages predictive AI forecasting to project stockout risks, prevent overstocking, and calculate optimal safety stock levels.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

