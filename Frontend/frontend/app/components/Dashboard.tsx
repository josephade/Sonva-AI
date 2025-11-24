"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Html, OrbitControls, Sphere, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useRef, Suspense } from "react";
import { PhoneIncoming, CalendarCheck2, BarChart3 } from "lucide-react";
import BookNowButton from "./BookNowButton";

const stats = [
  { icon: <PhoneIncoming className="w-6 h-6 text-primary" />, value: "156", label: "Calls This Week" },
  { icon: <CalendarCheck2 className="w-6 h-6 text-primary" />, value: "148", label: "Appointments Booked" },
  { icon: <BarChart3 className="w-6 h-6 text-primary" />, value: "94.8%", label: "Conversion Rate" },
];

function HolographicRings() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={group}>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3 + i * 0.6, 0.02, 16, 100]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#8b5cf6" : "#06b6d4"}
            emissive={i % 2 === 0 ? "#8b5cf6" : "#06b6d4"}
            emissiveIntensity={0.4}
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingParticles() {
  const points = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  const vertices = new Float32Array(1000 * 3);
  for (let i = 0; i < vertices.length; i++) {
    vertices[i] = (Math.random() - 0.5) * 10;
  }

  return (
    <points ref={points}>
      
      <bufferGeometry>
  <bufferAttribute
    attach="attributes-position"
    args={[vertices, 3]}   // <-- FIX
  />
</bufferGeometry>

      <pointsMaterial color="#9b87f5" size={0.05} transparent opacity={0.6} />
    </points>
  );
}
// MAIN DASHBOARD 
const Dashboard = () => {
  return (
    <section className="relative py-40 overflow-hidden">

      
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.12),transparent_70%),radial-gradient(circle_at_70%_70%,rgba(6,182,212,0.12),transparent_70%)] animate-gradient-slow" />

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1.2} />
          <Suspense fallback={null}>
            <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
              <HolographicRings />
              <FloatingParticles />
            </Float>
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>
      </div>
      
      {/* Foreground */}
      <div className="relative container mx-auto px-4 z-10">

        
        
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            See Every Dental Inquiry
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Turn Into Patients
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Track which calls book appointments, request emergency care, or need your team's attention.
          </p>
        </motion.div>

        {/* Dashboard Preview in 3D */}
        <div className="relative max-w-5xl mx-auto mb-16">
          <div className="absolute -inset-10 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-70 rounded-[2rem]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ rotateX: 5, rotateY: -5, scale: 1.03 }}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-lg shadow-[0_0_40px_rgba(0,0,0,0.2)]"
          >
            <img
              src="/dashboard-preview.jpg"
              alt="Sonva AI Dashboard"
              className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Floating Glass Reflection */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0"
              animate={{ opacity: [0, 0.6, 0], x: ["-100%", "200%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              whileHover={{ y: -6, scale: 1.05 }}
              className={`relative group p-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)]`}
            >
              <div className="relative flex flex-col items-center justify-center space-y-3 z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-inner backdrop-blur-sm">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-primary drop-shadow-sm">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-2xl animate-gradient-slow" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    
  );
};

export default Dashboard;
