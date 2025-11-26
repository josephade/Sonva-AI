"use client";

import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Check, Workflow, ArrowRight, Zap } from "lucide-react";
import * as THREE from "three";
import BookNowButton from "./BookNowButton";

const integrations = [
  { name: "Dentrix", logo: "🦷", color: "from-blue-500/20 to-cyan-500/20" },
  { name: "Open Dental", logo: "📋", color: "from-purple-500/20 to-pink-500/20" },
  { name: "Eaglesoft", logo: "🦅", color: "from-orange-500/20 to-red-500/20" },
  { name: "Dentally", logo: "💼", color: "from-green-500/20 to-emerald-500/20" },
  { name: "Curve Dental", logo: "📊", color: "from-indigo-500/20 to-blue-500/20" },
  { name: "Practice-Web", logo: "🌐", color: "from-teal-500/20 to-cyan-500/20" },
  { name: "Henry Schein", logo: "🏥", color: "from-rose-500/20 to-pink-500/20" },
  { name: "Patterson", logo: "📱", color: "from-amber-500/20 to-yellow-500/20" },
];

const features = [
  { icon: "⚡", title: "Instant Sync", description: "Automatic appointment syncing with your calendar in real-time" },
  { icon: "🔄", title: "Seamless Flow", description: "Patient data flows directly to your PMS without manual entry" },
  { icon: "✓", title: "Live Updates", description: "Real-time availability checking across all platforms" },
  { icon: "🔗", title: "Two-Way Sync", description: "Bidirectional communication with your existing systems" },
];

function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000 * 3; i++) arr[i] = (Math.random() - 0.5) * 15;
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (points.current) {
      points.current.rotation.y = t * 0.05;
      points.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <Points ref={points} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#9b87f5"
          size={0.07}
          sizeAttenuation
          depthWrite={false}
          opacity={0.5}
        />
      </Points>
    </group>
  );
}

const ORBIT_SPEED = 0.2; 

function OrbitingIntegrations() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let frame: number;
    const update = () => {
      setAngle((prev) => (prev + ORBIT_SPEED) % 360);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  const radius = 45;

  return (
    <div className="relative aspect-square max-w-xl mx-auto w-full">
      {/* Center hub */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent 
                      flex items-center justify-center shadow-[0_0_60px_rgba(var(--primary),0.4)] 
                      z-10 animate-pulse">
        <Zap className="w-12 h-12 text-primary-foreground animate-spin-slow" />
      </div>

      {/* Orbiting items */}
      {integrations.map((integration, index) => {
        const baseAngle = (index * 360) / integrations.length;
        const totalAngle = baseAngle + angle;
        const x = 50 + radius * Math.cos((totalAngle * Math.PI) / 180);
        const y = 50 + radius * Math.sin((totalAngle * Math.PI) / 180);

        return (
          <div
            key={index}
            className="absolute group cursor-pointer transition-transform duration-300"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${integration.color} 
                          backdrop-blur-xl border border-border/50 flex flex-col items-center 
                          justify-center gap-1 transition-all duration-300 
                          hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.3)]`}
            >
              <span className="text-3xl">{integration.logo}</span>
              <span className="text-[0.5rem] font-semibold text-center px-1 leading-tight opacity-0 
                               group-hover:opacity-100 transition-opacity">
                {integration.name.split(" ")[0]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const Integrations = () => {
  return (
    <section className="relative py-4 pt-20 overflow-hidden">
      {/* Cinematic 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 65 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.2} />
          <Suspense fallback={null}>
            <ParticleField />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 backdrop-blur-[2px]" />
      </div>

      {/* Mid-section CTA */}
      <div className="relative z-20 flex justify-center mb-16 -mt-19">
        <BookNowButton href="#book-demo" />
      </div>


      {/* Content */}
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-20 space-y-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                            bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 
                            backdrop-blur-sm">
              <Workflow className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Seamless Integrations
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block">Connect Your</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Dental Practice Software
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              One intelligent workspace that brings all your tools together. No more switching between systems.
            </p>
          </motion.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left side with continuous orbit */}
            <OrbitingIntegrations />

            {/* Right side features */}
            <div className="space-y-8">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl md:text-4xl font-bold">
                  Everything Connected,
                  <span className="block text-primary">Everything Automated</span>
                </h3>
                <p className="text-lg text-muted-foreground">
                  Your practice management system, scheduling tools, and communication platforms working as one intelligent ecosystem.
                </p>
              </motion.div>

              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group relative p-6 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 
                               backdrop-blur-sm border border-border/50 hover:border-primary/50 
                               transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] 
                               hover:-translate-y-1"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 
                                      flex items-center justify-center text-2xl flex-shrink-0 
                                      group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold">{feature.title}</h4>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 
                                                group-hover:opacity-100 group-hover:translate-x-0 
                                                transition-all" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full 
                            bg-gradient-to-r from-card to-card/50 border border-border/50 
                            backdrop-blur-sm">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">
                Works with <span className="font-bold text-primary">{integrations.length}+</span> dental practice management systems
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
