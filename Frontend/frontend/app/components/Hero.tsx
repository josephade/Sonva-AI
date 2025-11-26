"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Phone, BarChart3, Play } from "lucide-react";
import Demo from "./Demo";
import { useIsMobile } from "../utils/useIsMobile";

const Hero = () => {
  const [showDemo, setShowDemo] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

        {/* ==== BACKGROUND (desktop only) ==== */}
        {!isMobile && (
          <>
            {/* Background Image */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/hero-bg.jpg')" }}
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Floating gradient clouds */}
            <motion.div
              className="absolute top-[-10%] left-[10%] w-[600px] h-[600px]
              bg-gradient-to-br from-primary/40 to-accent/40 blur-[120px]
              rounded-full opacity-40"
              animate={{ x: 40, y: -20, rotate: 10 }}
              transition={{
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            <motion.div
              className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px]
              bg-gradient-to-tr from-accent/30 to-primary/30 blur-[100px]
              rounded-full opacity-30"
              animate={{ x: -30, y: 20, scale: 1.05 }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </>
        )}

        {/* ==== FOREGROUND ==== */}
        <div className="container relative z-10 px-4 py-20 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-primary/10 text-primary border border-primary/20"
            >
              {!isMobile && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              <span className="text-sm font-medium">
                AI-Powered Dental Reception
              </span>
            </div>

            {/* ===== HEADING (Fully fixed) ===== */}
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-balance"
              initial={{ y: 40, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,

                // Desktop glow animation merged here (no conflicts)
                ...(isMobile
                  ? {}
                  : {
                      textShadow: [
                        "0 0 20px rgba(147, 197, 253, 0.4)",
                        "0 0 40px rgba(192, 132, 252, 0.6)",
                        "0 0 20px rgba(147, 197, 253, 0.4)",
                      ],
                    }),
              }}
              transition={{
                duration: 0.8,
                ...(isMobile
                  ? {}
                  : {
                      textShadow: {
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "mirror",
                      },
                    }),
              }}
            >
              The Future of{" "}
              <span className="font-black text-primary">Dental</span> Care
              <br className="hidden lg:block" />

              {/* Animated gradient (desktop), static on mobile */}
              <span
                className={`
                inline-block whitespace-nowrap bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent
                ${isMobile ? "" : "bg-[length:200%_auto] animate-gradient"}
              `}
              >
                Starts With a Conversation
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-[1.25rem] md:text-[1.35rem] text-muted-foreground 
              max-w-[52rem] mx-auto leading-snug tracking-tight text-balance"
              initial={isMobile ? {} : { y: 30, opacity: 0 }}
              animate={isMobile ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Let Sonva handle appointment scheduling, patient inquiries, and cancellations — built for
              <span className="font-semibold text-primary"> Irish </span>
              and
              <span className="font-semibold text-accent"> UK </span>
              clinics.
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
              initial={isMobile ? {} : { y: 20, opacity: 0 }}
              animate={isMobile ? {} : { y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => setShowDemo(true)}
                className="group inline-flex items-center gap-3 h-14 pl-4 pr-8 rounded-full 
                text-base font-semibold bg-white border border-primary/30 text-primary
                transition-all duration-300 hover:bg-primary hover:text-white shadow-sm"
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white
                  group-hover:bg-white group-hover:text-primary transition-all"
                >
                  <Play className="w-4 h-4" />
                </div>
                <span className="font-semibold">See it in Action</span>
              </button>
            </motion.div>

            {/* Stats (static on mobile) */}
            <div className="grid grid-cols-3 gap-8 pt-6 max-w-2xl mx-auto">
              {[
                { icon: Phone, label: "24/7 - Always Available" },
                { icon: "gdpr.png", label: "GDPR Compliant" },
                { icon: BarChart3, label: "Quick Setup" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-center">
                    {typeof stat.icon === "string" ? (
                      <img
                        src={`/${stat.icon}`}
                        className="h-9 w-9 object-contain brightness-110"
                      />
                    ) : (
                      <stat.icon className="h-6 w-6 text-primary mb-2" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DEMO OVERLAY */}
      <Demo isActive={showDemo} onClose={() => setShowDemo(false)} />
    </>
  );
};

export default Hero;
