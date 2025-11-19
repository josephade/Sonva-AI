"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

interface BookNowButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const BookNowButton = ({
  label = "Book Now",
  href = "#",
  onClick,
  className = "",
}: BookNowButtonProps) => {
  const button = (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 30px rgba(59,130,246,0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                  rounded-full font-semibold text-base bg-gradient-to-r 
                  from-primary to-accent text-white shadow-lg transition-all 
                  duration-300 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)] 
                  ${className}`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
        <CalendarDays className="w-5 h-5" />
      </div>
      <span className="tracking-tight">{label}</span>
    </motion.button>
  );

  return href ? (
    <a href={href} className="inline-block">
      {button}
    </a>
  ) : (
    button
  );
};

export default BookNowButton;
