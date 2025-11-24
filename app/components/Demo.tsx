"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface DemoProps {
  isActive: boolean;
  onClose: () => void;
}

const Demo = ({ isActive, onClose }: DemoProps) => {
  const [step, setStep] = useState(0);

  // Timed sequence flow
  useEffect(() => {
    if (!isActive) return;

    const timers = [
      setTimeout(() => setStep(1), 4000),
      setTimeout(() => setStep(2), 7500), 
      setTimeout(() => {
        onClose();
        setStep(0);
      }, 11000),
    ];

    return () => timers.forEach((t) => clearTimeout(t));
  }, [isActive, onClose]);

  const fadeVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.8 } },
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="demo"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-b from-[#020617] to-[#0a0f1f] text-white text-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Subtle glowing backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary/10 via-accent/10 to-transparent blur-[100px]"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/*  STEP 0  */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <p className="text-3xl font-semibold">Starting demo...</p>
              <p className="text-lg text-gray-300">
                For the full experience, ensure your volume is on.
              </p>
              <p className="text-sm text-gray-400">
                This audio has NOT been edited.
              </p>
            </motion.div>
          )}

          {/*  STEP 1  */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4 flex flex-col items-center"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-2xl font-medium">
                Front desk is busy <br /> or call is after hours...
              </p>
            </motion.div>
          )}

          {/*  STEP 2  */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8 flex flex-col items-center relative"
            >
              {/*  Orb Glow Layers */}
              <motion.div
                className="absolute w-[300px] h-[300px] rounded-full bg-primary/10 blur-[120px] opacity-70"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-[180px] h-[180px] rounded-full bg-accent/10 blur-[100px] opacity-60"
                animate={{
                  scale: [1.1, 1.4, 1.1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Core Orb  */}
              <motion.div
                className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.5)]"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.9, 1, 0.9],
                  boxShadow: [
                    "0 0 30px rgba(59,130,246,0.4)",
                    "0 0 60px rgba(59,130,246,0.7)",
                    "0 0 30px rgba(59,130,246,0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,0.8)]" />
              </motion.div>

              <motion.p
                className="text-2xl font-semibold relative z-10 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.2 }}
              >
                Sonva picks up, <br /> 24/7...
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Demo;
