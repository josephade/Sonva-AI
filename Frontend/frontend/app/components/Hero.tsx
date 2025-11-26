"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, Phone, BarChart3 } from "lucide-react";
import Demo from "./Demo";

const Hero = () => {
  const controls = useAnimation();
  const [showDemo, setShowDemo] = useState(false);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    controls.start({
      textShadow: [
        "0 0 20px rgba(147, 197, 253, 0.4)",
        "0 0 40px rgba(192, 132, 252, 0.6)",
        "0 0 20px rgba(147, 197, 253, 0.4)",
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "mirror",
      },
    });
  }, [controls]);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Background Layers */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Floating gradient cloud */}
        <motion.div
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-primary/40 to-accent/40 blur-[120px] rounded-full opacity-40"
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: 40, y: -20, rotate: 10 }}
          transition={{ duration: 10, ease: "easeInOut" }}
        />

        {/* Bottom-right gradient */}
        <motion.div
          className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-accent/30 to-primary/30 blur-[100px] rounded-full opacity-30"
          initial={{ x: 0, y: 0, scale: 1 }}
          animate={{ x: -30, y: 20, scale: 1.05 }}
          transition={{ duration: 8, ease: "easeInOut" }}
        />

        {/* CONTENT */}
        <div className="container relative z-10 px-4 py-20 mx-auto text-center">
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15, delayChildren: 0.4 },
              },
            }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm font-medium">
                AI-Powered Dental Reception
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-balance"
              variants={{
                hidden: { y: 40, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              animate={controls}
            >
              The Future of{" "}
              <span className="font-black text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                Dental
              </span>{" "}
              Care
              <br className="hidden lg:block" />
              <motion.span
                className="inline-block whitespace-nowrap bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient font-extrabold"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Starts with a Conversation
              </motion.span>
            </motion.h1>

            {/* SUBHEADLINE (FIXED ON MOBILE) */}
            <motion.p
              className="
                text-base sm:text-lg md:text-[1.35rem]
                text-muted-foreground 
                max-w-[90%] sm:max-w-[52rem]
                mx-auto 
                leading-snug 
                text-center 
                tracking-tight 
                mt-4
              "
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Let Sonva handle appointment scheduling, patient inquiries, and
              cancellations - built for{" "}
              <span className="font-semibold text-primary">Irish</span> and{" "}
              <span className="font-semibold text-accent">UK</span> clinics.
            </motion.p>

            {/* CTA BUTTON (CENTERED ON MOBILE) */}
            <motion.div
              className="
                flex flex-col 
                items-center 
                justify-center 
                gap-4 
                pt-6
                w-full
              "
              initial={isMobile ? { opacity: 1 } : { y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => setShowDemo(true)}
                className="
                  group 
                  inline-flex 
                  items-center 
                  justify-center
                  gap-3 
                  h-14 
                  px-6
                  rounded-full 
                  font-semibold 
                  bg-white 
                  border border-primary/30 
                  text-primary 
                  transition-all 
                  duration-300 
                  hover:bg-primary 
                  hover:text-white 
                  shadow-sm
                  w-55 sm:w-200
                "
              >
                <div
                  className="
                    flex items-center justify-center 
                    w-9 h-9 
                    rounded-full 
                    bg-primary text-white
                    group-hover:bg-white 
                    group-hover:text-primary 
                    transition-all
                  "
                >
                  <Play className="w-4 h-4" />
                </div>
                <span className="font-semibold">See it in Action</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 pt-6 max-w-2xl mx-auto"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 1.2,
                  },
                },
              }}
            >
              {[
                { icon: Phone, label: "24/7 - Always Available" },
                { icon: "gdpr.png", label: "GDPR Compliant" },
                { icon: BarChart3, label: "Quick Setup" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="space-y-2"
                  variants={{
                    hidden: { y: 30, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <div className="flex items-center justify-center">
                    {typeof stat.icon === "string" ? (
                      <img
                        src={`/${stat.icon}`}
                        alt={stat.label}
                        className="h-9 w-9 object-contain brightness-110 drop-shadow-md"
                      />
                    ) : (
                      <stat.icon className="h-6 w-6 text-primary mb-2" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Demo isActive={showDemo} onClose={() => setShowDemo(false)} />
    </>
  );
};

export default Hero;
