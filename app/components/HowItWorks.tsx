"use client";

import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useRef, Suspense } from "react";

const steps = [
  {
    number: 1,
    title: "Setup Your Dental AI Assistant",
    description:
      "Tell us about your dental practice, services, insurance accepted, and scheduling preferences. Our AI learns your workflow in minutes.",
    color: "#3B82F6",
  },
  {
    number: 2,
    title: "Forward Your Practice Calls",
    description:
      "Simply redirect your dental office phone to our AI receptionist. Patients experience faster, smarter, friendlier service — 24/7.",
    color: "#22C55E",
  },
  {
    number: 3,
    title: "Watch Your Practice Grow",
    description:
      "Receive detailed reports, appointment confirmations, emergency alerts, and analytics — while you focus on care.",
    color: "#F97316",
  },
];

// === Floating Ambient Orbs ===
function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={group}>
      {[...Array(12)].map((_, i) => (
        <Float
          key={i}
          speed={1.5}
          rotationIntensity={0.5}
          floatIntensity={0.8}
        >
          <Sphere args={[0.06, 16, 16]} position={[
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
          ]}>
            <meshStandardMaterial
              color={i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#06b6d4" : "#f59e0b"}
              emissiveIntensity={0.4}
              emissive={i % 2 ? "#8b5cf6" : "#06b6d4"}
              transparent
              opacity={0.7}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

// === MAIN SECTION ===
const HowItWorks = () => {
  return (
    <section className="relative py-40 overflow-hidden">
      {/* === Cinematic 3D Background === */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 70 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 3, 3]} intensity={1.2} />
          <Suspense fallback={null}>
            <FloatingOrbs />
            <Stars radius={50} count={4000} factor={3} fade speed={1} />
          </Suspense>
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95 backdrop-blur-[2px]" />
      </div>

      {/* === Header === */}
      <div className="relative z-10 container mx-auto px-4 max-w-5xl text-center mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Three immersive steps to transform your dental practice’s communication.
        </motion.p>
      </div>

      {/* === Steps Grid === */}
      <div className="relative z-10 container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:gap-24 gap-12 relative">
          {/* Connecting line glow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 2 }}
            className="absolute left-8 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-accent to-transparent blur-sm opacity-40 md:left-1/2 md:-translate-x-1/2"
          />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 1 }}
              className={`relative flex flex-col md:flex-row items-center md:even:flex-row-reverse gap-10`}
            >
              {/* Orb with glow */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                  style={{ backgroundColor: step.color }}
                >
                  {step.number}
                </div>
                <div
                  className="absolute inset-0 blur-3xl opacity-60"
                  style={{ backgroundColor: step.color }}
                />
              </motion.div>

              {/* Step Card */}
              <motion.div
                className="flex-1 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-xl border border-border/50 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] group hover:border-primary/50 hover:shadow-[0_0_60px_rgba(0,0,0,0.3)] transition-all duration-500"
                whileHover={{ y: -6 }}
              >
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-24"
        >
          <div className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
            <span className="text-primary font-semibold">Ready in under 1 hour</span>
            <span className="text-muted-foreground">• Minimal setup required</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
