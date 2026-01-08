"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroProps {
  onOpenDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  const { scrollY } = useScroll();
  const router = useRouter();

  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-20 overflow-hidden">
      {/* Background Gradients */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/4"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/4"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          Now supporting NHS & Private Clinics
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#0F172A] mb-6"
        >
          Your Dental Receptionist,
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-purple-600">
            Powered by AI.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-base md:text-xl text-slate-500 mb-8 max-w-3xl"
        >
          Sonva answers every call, books appointments instantly, and gives your
          clinic a world-class patient experience — 24/7.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {/* ✅ BOOK A DEMO */}
          <motion.button
            onClick={() => router.push("/book-a-demo")}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            <span className="flex items-center gap-2">
              <Calendar size={20} />
              Book a Demo
            </span>
          </motion.button>

          {/* Listen CTA */}
          <motion.button
            onClick={onOpenDemo}
            whileHover={{ y: -4 }}
            className="px-8 py-4 bg-white text-slate-700 border border-slate-100 rounded-full font-bold shadow hover:shadow-xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            Listen to Sonva
          </motion.button>
        </motion.div>


        {/* Voice Animation Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 relative w-full max-w-4xl"
        >
          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] border border-white/60 p-6 md:p-8 flex items-center gap-6 relative overflow-hidden group">
             {/* Abstract Voice Waves */}
             <div className="flex items-center justify-center gap-1.5 h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] bg-blue-50 shrink-0 group-hover:bg-blue-100 transition-colors duration-500">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [12, 45, 20, 60, 12],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.12,
                    }}
                    className="w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(42,111,242,0.3)]"
                  />
                ))}
             </div>
             
             <div className="flex-1 text-left space-y-2">
                <div className="flex items-center gap-3">
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">Live Call</span>
                   <span className="text-xs font-bold text-slate-400">Dublin, IE • Active Session</span>
                </div>
                <p className="text-lg md:text-2xl font-bold text-[#0F172A] leading-tight tracking-tight">
                  "I've found a slot for your dental implant consultation with Dr. O'Connor. Tuesday at 2:30 PM works perfectly. Shall I lock that in for you?"
                </p>
             </div>

             <div className="absolute -right-16 -top-16 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all duration-1000"></div>
             <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-purple-500/5 rounded-full blur-[80px] group-hover:bg-purple-500/10 transition-all duration-1000"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
