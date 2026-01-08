"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const BookNowCTA: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center py-4 md:py-6 pointer-events-none">
      <motion.button
        onClick={() => router.push("/book-a-demo")}
        whileHover={{
          scale: 1.05,
          y: -2,
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pointer-events-auto group relative flex items-center gap-3 pl-4 pr-6 py-2.5 bg-white rounded-full shadow-md shadow-blue-900/5 border border-blue-100/50 hover:border-primary/30 transition-all duration-300"
      >
        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Icon */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white shadow-sm group-hover:shadow-blue-500/30 transition-all">
          <CalendarCheck size={12} strokeWidth={3} />
        </div>

        {/* Text */}
        <span className="relative text-sm font-bold text-slate-700 group-hover:text-primary transition-colors tracking-tight">
          Book a Demo
        </span>
      </motion.button>
    </div>
  );
};

export default BookNowCTA;
