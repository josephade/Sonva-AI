"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, Phone, Calendar, BarChart3 } from "lucide-react";

const Hero = () => {
  const controls = useAnimation();

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated Background Layers */}
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
        animate={{
          x: 40,
          y: -20,
          rotate: 10,
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
        }}
      />

      {/* Bottom-right gradient */}
      <motion.div
        className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-accent/30 to-primary/30 blur-[100px] rounded-full opacity-30"
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: -30,
          y: 20,
          scale: 1.05,
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
        }}
      />

      {/* Foreground Content */}
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
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-medium">
              AI-Powered Dental Reception
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
            variants={{
              hidden: { y: 40, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            animate={controls}
          >
            Focus on Your Patients,
            <motion.span
              className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Not the Phone
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            Let Sonva handle appointment scheduling, patient inquiries, and
            cancellations for your dental practice — 24/7.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <motion.button
              whileHover={{
                scale: 1.07,
                boxShadow: "0 0 40px rgba(147, 197, 253, 0.5)",
              }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center justify-center gap-2 rounded-md text-base font-medium h-14 px-10 bg-gradient-to-r from-primary to-accent text-primary-foreground transition-all duration-300"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "hsl(var(--accent))",
                color: "white",
              }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 rounded-md text-base font-medium h-14 px-10 border border-input bg-background transition-colors"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Floating Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2, delayChildren: 1.2 },
              },
            }}
          >
            {[
              { icon: Phone, value: "24/7", label: "Always Available" },
              { icon: Calendar, value: "95%", label: "Booking Rate" },
              { icon: BarChart3, value: "3x", label: "More Patients" },
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
                  <stat.icon className="h-6 w-6 text-primary mb-2" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
